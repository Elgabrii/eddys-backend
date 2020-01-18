/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const fetchQuery = require('../utils/fetch-query');
const sendError = require('../utils/send-error');
const makeError = require('../utils/make-error');
module.exports = {
  find: (req, res) => {
    if (!req.currentUser.role === 'admin') {
      req.query.auth = req.currentUser.id;
    }
    let { dataQuery, countQuery } = fetchQuery(req, Order);

    Promise.all([dataQuery, countQuery])
      .then(responses => {
        return res.status(200).json({
          message: 'Fetched orders',
          results: responses[0].map(x => ({
            ...x,
          })),
          count: responses[1],
        });
      })
      .catch(err => sendError(makeError(400, err.message, err.name), res));
  },
  create: async (req, res) => {
    const orderBody = req.body;
    orderBody.auth = req.currentUser.id;
    orderBody.status = 'pending';
    let ordreObj;
    try {
      ordreObj = await Order.create(orderBody).fetch();
    } catch (err) {
      return sendError(makeError(400, err.message, err.name), res);
    }
    return res.status(201).json({
      message: 'Created order successfully,\nPlease complete your payment.',
      order: ordreObj,
    });
  },
};

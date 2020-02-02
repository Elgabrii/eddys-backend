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
  // TODO: add privacy access or admin
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
  // TODO: add privacy access or admin
  create: async (req, res) => {
    const orderBody = req.body.order;
    orderBody.auth = req.currentUser.id;
    orderBody.status = 'pending';
    const productIDs = orderBody.products;
    const paymentBody = req.body.payment;
    let responseBody = {};
    try {
      const products = await Products.find({
        id: {
          in: productIDs,
        },
      });
      const userProfile = await Users.findOne({
        auth: req.currentUser.id,
      });
      const totalAmount = products.reduce((acc, curr) => acc + curr.price, 0);
      responseBody.ordreObj = await Order.create(orderBody).fetch();
      responseBody.paymentOrder = await PaymentOrder.create({
        status: 'pending',
        ...paymentBody,
        currency: 'EGP',
        completed: false,
        amount: totalAmount,
        auth: req.currentUser.id,
        user: userProfile.id,
        orders: [responseBody.ordreObj.id],
      });
    } catch (err) {
      return sendError(makeError(400, err.message, err.name), res);
    }
    return res.status(201).json({
      message: 'Created order successfully,\nPlease complete your payment.',
      ...responseBody,
    });
  },
  editProducts: async (req, res) => {
    const orderID = req.params.id;
    const action = req.params.action;
    if (!action in ['add', 'remove']) {
      return sendError(
        makeError(404, 'Sorry, invalid action', 'NotFound'),
        res
      );
    }
    let productIDs = req.body.products;
    try {
      // TODO: add privacy or admin
      let order = await Order.findOne({ id: orderID }).populateAll();
      const orderProducts = order.products.map(x => x.id);
      productIDs = productIDs.filter(
        id =>
          (action === 'add' && !orderProducts.includes(id)) ||
          (action === 'remove' && orderProducts.includes(id))
      );
      if (!order) {
        return sendError(
          makeError(404, 'Sorry, could not find your order', 'NotFound'),
          res
        );
      }

      let payment = order.paymentOrder;

      if (!payment) {
        return sendError(
          makeError(
            404,
            'Sorry, could not find your payment details.',
            'NotFound'
          ),
          res
        );
      }

      const products = await Products.find({
        id: {
          in: productIDs,
        },
      });

      // update products relation
      let associations = await (action === 'add'
        ? Order.addToCollection(orderID, 'products').members(productIDs)
        : Order.removeFromCollection(orderID, 'products').members(productIDs));
      const newProductsPrice = products
        .map(x => x.price)
        .reduce((acc, curr) => acc + curr, 0);
      const newTotal =
        payment.amount + newProductsPrice * (action === 'remove' ? -1 : 1);

      // update total price of payment
      payment = await PaymentOrder.updateOne({
        id: order.paymentOrder.id,
      }).set({ amount: newTotal });

      return res.status(200).json({
        message: 'Edited products of order',
        payment,
        order,
        associations,
      });
    } catch (err) {
      return sendError(
        makeError(
          400,
          err.message || 'Failed to add product to order.',
          err.name
        ),
        res
      );
    }
  },
};

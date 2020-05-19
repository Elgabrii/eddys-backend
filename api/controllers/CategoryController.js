/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const sendError = require('../utils/send-error');
const makeError = require('../utils/make-error');
const fetchQuery = require('../utils/fetch-query');

module.exports = {
  fetchCategory: async function(req, res) {
    try {
      const category = await Category.findOne({
        id: req.param('category_id')
      }).populateAll();
      const productsIds = category.products.map(
        product => product.id
      )
      let criteria = {
        id: {
          in: productsIds
        }
      }
      const products = await Products.find(criteria).populateAll();
      const productsCount = await Products.count(criteria);
      return res.status(200).json({
        products,
        count: productsCount
      });
    }
    catch(err) {
      sendError(makeError(400, err.message, err.name), res)
    }
  }
};


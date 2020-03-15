/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const fetchQuery = require('../utils/fetch-query');
const sendError = require('../utils/send-error');
const makeError = require('../utils/make-error');
const axios = require('axios');
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
    let responseBody = {};
    const products = await Products.find({
      id: {
        in: productIDs,
      },
    });
    const userProfile = await Users.findOne({
      auth: req.currentUser.id,
    });
    // amount in cents
    const totalAmount = products.reduce((acc, curr) => acc + curr.price, 0);
    console.log('totalAmount', totalAmount);
    try {
      responseBody.orderObj = await Order.create({
        ...orderBody,
        status: 'pending',
        currency: 'EGP',
        completed: false,
        amount: totalAmount,
        auth: req.currentUser.id,
        user: userProfile.id,
      }).fetch();
    } catch (err) {
      return sendError(makeError(400, err.message, err.name), res);
    }
    console.log('responseBody.orderObj', responseBody.orderObj);

    try {
      // accept payment
      if (responseBody.orderObj.method === 'we-accept') {
        const acceptOrderResponse = await axios.post(
          `${sails.config.ACCEPT_API_ROOT}/ecommerce/orders`,
          {
            auth_token: sails.config.ACCEPT_AUTH_TOKEN,
            // TODO: ASK about delivery
            delivery_needed: 'false',
            merchant_id: sails.config.ACCEPT_MERCHANT_ID,
            amount_cents: responseBody.orderObj.amount * 100,
            currency: responseBody.orderObj.currency,
            merchant_order_id: responseBody.orderObj.id,
            items: [],
          }
        );
        // console.log('acceptOrderResponse', acceptOrderResponse.data);

        const paymentKeyResponse = await axios.post(
          `${sails.config.ACCEPT_API_ROOT}/acceptance/payment_keys`,
          {
            auth_token: sails.config.ACCEPT_AUTH_TOKEN,
            amount_cents: responseBody.orderObj.amount * 100,
            expiration: 360000,
            order_id: acceptOrderResponse.data.id,
            currency: acceptOrderResponse.data.currency,
            integration_id: sails.config.ACCEPT_INTEGRATION_ID,
            billing_data: {
              email: req.currentUser.email,
              first_name: userProfile.name,
              phone_number: userProfile.phoneNumber,
              // TODO: dynamic billing fields
              city: 'Cairo',
              country: 'EG',
              state: 'Cairo',
              appartment: 10,
              building: 1,
              street: 'Test Street',
              floor: 1,
              apartment: 1,
              last_name: 'Account',
            },
          }
        );
        responseBody.iframeURL =
          'https://accept.paymobsolutions.com/api/acceptance/iframes/18072?payment_token=' +
          paymentKeyResponse.data.token;
        responseBody.paymentToken = paymentKeyResponse.data.token;
      }
    } catch (e) {
      console.error(e.response.data);
      console.log('ACCEPT::ERROR::', Object.keys(e.response));
      if (e.code === 401) {
        console.error('WE ACCEPT ERROR:: Authentication::', JSON.stringify(e));
      } else {
        // console.error(e);
      }
      // TODO: delete payment Order?
      return sendError(makeError(400, e.message, e.name), res);
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
      payment = await Order.updateOne({
        id: order.id,
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

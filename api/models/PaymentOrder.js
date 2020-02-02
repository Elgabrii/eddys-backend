/**
 * PaymentOrder.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    amount: {
      type: 'number',
      required: true,
      columnType: 'decimal',
    },
    completed: {
      type: 'boolean',
      defaultsTo: false,
    },
    currency: {
      type: 'string',
      defaultsTo: 'USD',
    },
    method: {
      type: 'string',
      isIn: ['cash', 'square'],
    },
    status: {
      type: 'string',
      isIn: ['pending', 'confirmed', 'completed', 'cancelled'],
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    auth: {
      // who created the payment order
      model: 'auth',
      required: true,
    },
    user: {
      // for which profile the order belongs to
      model: 'users',
      required: true,
    },
    orders: {
      collection: 'order',
      via: 'paymentOrder',
    },
  },
  tableName: 'payment_orders',
};

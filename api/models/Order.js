/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'string',
      unique: true,
      columnName: '_id',
    },
    status: {
      type: 'string',
      isIn: ['pending', 'completed', 'cancelled', 'declined'],
    },
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
      isIn: ['cash', 'we-accept'],
    },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    products: {
      collection: 'products',
      via: 'orders',
    },
    user: {
      // for which profile the order belongs to
      model: 'users',
      required: true,
    },

    auth: {
      model: 'auth',
    },
  },
};

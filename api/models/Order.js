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
      isIn: ['pending', 'paid','completed', 'cancelled', 'declined'],
    },
    amount: {
      type: 'number',
      required: true,
      columnType: 'decimal',
    },
    paid_amount: {
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
    city: {
      type: 'string',
    },
    country: {
      type: 'string',
      defaultsTo: 'EG'
    },
    appartment: {
      type: 'number'
    },
    building: {
      type: 'number'
    },
    floor: {
      type: 'number'
    },
    street: {
      type: 'string'
    },
    landmark: {
      type: 'string'
    },
    orderDeliveryTime: {
      type: 'string'
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
    items: {
      collection: 'orderitem',
      via: 'order',
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

/**
 * Products.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'string',
      unique: true,
      columnName: '_id',
    },
    category: {
      model: 'category',
      // required: true
    },
    nameEnglish: {
      type: 'string',
      required: true,
    },
    nameArabic: {
      type: 'string',
    },
    descriptionEnglish: {
      type: 'string',
    },
    descriptionArabic: {
      type: 'string',
    },
    price: {
      type: 'number',
      required: true,
    },
    quantity: {
      type: 'number',
      required: true,
    },
    images: {
      type: 'json',
      columnType: 'array',
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
    orders: {
      collection: 'order',
      via: 'products',
    },
  },
  datastore: 'default',
};

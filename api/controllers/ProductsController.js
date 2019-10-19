/**
 * ProductsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  fetchProducts: async function(req, res) {
    try {
      const products = await Products.find();
      res.send(products);
    }
    catch(err) {
      res.send(err);
    }
  },
  fetchProduct: async function(req, res) {
    try {
      const product = await Products.findOne({
        id: req.param('product_id')
      });
      res.send(product);
    }
    catch(err) {
      res.send(err);
    }
  },
  searchProducts: async function(req, res) {

    // db.stores.find( { $text: { $search: "java coffee shop" } } )
    const products = await Products.find({
      or:[
        {nameEnglish: { contains:req.body['searchKey'] }},
        {descriptionEnglish: { contains:req.body['searchKey'] }},
      ]
    });
    res.send(products);
  },
  addProduct: async function(req, res) {
    console.log(req.body);
    const toBeAddedProduct = await Products.create(req.body);
    res.status(201).json({
      message: 'product created successfully',
    });

  }
};


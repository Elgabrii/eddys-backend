/**
 * ProductsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  fetchProducts: async function(req, res) {
    try {
      const products = await Products.find().populateAll();
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
    const searchArray = req.body.searchKey.split(",")
    console.log(searchArray, 'results');
    const fields = ['nameEnglish', 'nameArabic', 'descriptionEnglish', 'descriptionArabic']
    const orArr = fields.reduce((accumlator, field) => {
      return accumlator.concat(searchArray.map(searchWord => ({
        [field]: {
          contains: searchWord
        }
      })));
    }, []);
    console.log(orArr,'orrArr');
    const products = await Products.find({
      or: orArr
      // [
      //   // {nameEnglish: { contains:req.body['searchKey'] }},
      //   // {nameArabic: { contains:req.body['searchKey'] }},
      //   {descriptionEnglish: { contains:req.body['searchKey'] }},
      //   // {descriptionArabic: { contains:req.body['searcshKey'] }},
      // ]
    });
    res.send(products);
  },
  addProduct: async function(req, res) {
    const toBeAddedProduct = await Products.create(req.body).fetch();
    res.status(201).json({
      message: 'product created successfully.',
      toBeAddedProduct
    });
  },
  deleteProduct: async function(req, res) {
    console.log(req.param('product_id'));
    try {
      const productToBeDeleted = await Products.destroyOne({
        id: req.param('product_id')
      });
      res.status(200).json({
        message: 'product deleted successfully.'
      });
    } catch(err) {
      res.send(err);
    }
  }
};


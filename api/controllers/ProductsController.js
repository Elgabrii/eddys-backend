/**
 * ProductsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const sendError = require('../utils/send-error');
const makeError = require('../utils/make-error');
const fetchQuery = require('../utils/fetch-query');
module.exports = {
  // TODO: handle error
  fetchProducts: (req, res) => {
    let { dataQuery, countQuery } = fetchQuery(req, Products);
    Promise.all([dataQuery, countQuery])
    .then(responses => {
      return res.status(200).json({
        message: 'Fetched Products',
        results: responses[0].map(x => ({
          ...x,
        })),
        count: responses[1],
      });
    })
    .catch(err => sendError(makeError(400, err.message, err.name), res));
    // try {
    //   const products = await Products.find().populateAll();
    //   res.send(products);
    // } catch (err) {
    //   res.send(err);
    // }
  },
  fetchProduct: async function(req, res) {
    try {
      const product = await Products.findOne({
        id: req.param('product_id'),
      }).populateAll();
      res.send(product);
    } catch (err) {
      res.send(err);
    }
  },
  searchProducts: async function(req, res) {
    // db.stores.find( { $text: { $search: "java coffee shop" } } )
    const searchArray = req.body.searchKey.split(',');
    const fields = [
      'nameEnglish',
      'nameArabic',
      'descriptionEnglish',
      'descriptionArabic',
    ];
    const orArr = fields.reduce((accumlator, field) => {
      return accumlator.concat(
        searchArray.map(searchWord => ({
          [field]: {
            contains: searchWord,
          },
        }))
      );
    }, []);
    const products = await Products.find({
      or: orArr,
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
    return res.status(201).json({
      message: 'product created successfully.',
      product: toBeAddedProduct,
    });
  },
  deleteProduct: async function(req, res) {
    console.log(req.param('product_id'));
    try {
      const productToBeDeleted = await Products.destroyOne({
        id: req.param('product_id'),
      });
      res.status(200).json({
        message: 'product deleted successfully.',
      });
    } catch (err) {
      res.send(err);
    }
  },
  addImage: (req, res) => {
    const { images, productID } = req.body;

    Products.addToCollection(productID, 'images')
      .members(images)
      .then(newItems => {
        return res.status(200).json({
          message: 'Added images to product',
          newItems,
        });
      })
      .catch(err => sendError(makeError(400, err.message, err.name), res));
  },
};

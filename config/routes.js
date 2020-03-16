/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/
  '/': { view: 'pages/homepage' },
  'post /paymob_notification_callback' : 'OrderController.handlePaymobPayment',
  'get /products': 'ProductsController.fetchProducts',
  'get /products/:product_id': 'ProductsController.fetchProduct',
  'post /products/searchProducts/': 'ProductsController.searchProducts',
  'post /products/images/upload': 'ProductsController.addImage',
  'post /products': 'ProductsController.addProduct',
  'delete /products/deleteProduct/:product_id':
    'ProductsController.deleteProduct',
  /***************************************************************************/
  'get /messages': 'MessagesController.fetchMessages',
  'get /messages/:message_id': 'MessagesController.fetchMessage',
  'post /messages': 'MessagesController.postMessage',
  'delete /messages/deleteMessage/:message_id':
    'MessagesController.deleteMessage',

  'get /users': 'UsersController.fetchUsers',
  'get /users/:user_id': 'UsersController.fetchUser',
  'post /users': 'UsersController.addUser',

  'get /transactions': 'TransactionsController.fetchTransactions',
  'post /auth/register': 'AuthController.register',
  'post /auth/login': 'AuthController.login',
  'post /file/upload': 'UploadController.upload',

  'POST /order/:id/products/:action': 'OrderController.editProducts',
  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};

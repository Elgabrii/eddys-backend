/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  '*': 'isAuthenticated',
  AuthController: {
    register: true,
    login: true,
  },
  OrderController: {
    '*': false,
    create: 'isAuthenticated',
    find: 'isAuthenticated',
    editProducts: 'isAuthenticated',
    handlePaymobPayment: true,
  },
  ProductsController: {
    find: true,
    findOne: true,
    '*': true,
  },
  UploadController: {
    '*': true,
  },
  CategoryController: {
    find: true,
    findOne: true,
    fetchCategory: true,
    create: true,
  },
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
};

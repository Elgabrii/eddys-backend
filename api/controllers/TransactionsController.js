/**
 * TransactionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  fetchTransactions: async function(req, res) {
    try {
      const transactions = await Transactions.find();
      res.send(transactions);
    }
    catch(err) {
      res.send(err);
    }
  },
};


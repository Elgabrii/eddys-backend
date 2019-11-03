/**
 * MessagesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  fetchMessages: async function(req, res) {
    try {
      const messages = await Messages.find();
      res.send(messages);
    }
    catch(err) {
      res.send(err);
    }
  },
  fetchMessage: async function(req, res) {
    try {
      const message = await Messages.findOne({
        id: req.param('message_id')
      });
      res.send(message);
    }
    catch(err) {
      res.send(err);
    }
  },
  postMessage: async function(req, res) {
    const messageToBePosted = await Messages.create(req.body);
    res.status(201).json({
      message: 'Message sent successfully.',
    });
  },
  deleteMessage: async function(req, res) {
    try {
      const messageToBeDeleted = await Messages.destroyOne({
        id: req.param('message_id')
      });
      res.status(200).json({
        message: 'Message deleted successfully.'
      });
    } catch(err) {
      res.send(err);
    }
  }

};


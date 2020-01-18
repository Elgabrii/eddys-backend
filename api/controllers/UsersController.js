/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // _config: {
  //   actions: true,
  //   rest: true,
  //   shortcuts: true
  // },
  fetchUsers: async function(req, res) {
    try {
      const users = await Users.find();
      res.send(users);
    }
    catch(err) {
      res.send(err);
    }
  },
  fetchUser: async function(req, res) {
    try {
      const user = await Users.findOne({
        id: req.param('user_id')
      }).populateAll();
      if(!user) throw new Error();
      res.send(user);
    }
    catch(err) {
      res.status(404).json(err);
    }
  },
  addUser: async function(req, res){
    await Users.create(req.body);
    res.status(201).json({
      message: 'user created successfully'
    });
  }
};


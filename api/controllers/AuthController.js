/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
// const validate = require('../validation/index');
// const validation = require('../validation/auth.validation');
const bcrypt = require('bcryptjs');
// const sendError = require('../utils/send-error');
// const makeError = require('../utils/make-error');
// var qr = require('qr-image');
// var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
  _config: {
    actions: true,
    shortcuts: true,
    rest: true,
  },

  register: async (req, res) => {
    req.body['role'] = 'normal';
    const responseBody = {};
    if (!req.body.auth || !req.body.userProfile) {
      return res.status(400).json({
        message: 'Missing body',
      });
    }
    Auth.create(req.body.auth)
      .fetch()
      .then(user => {
        req.body.userProfile.auth = user.id;
        return sails.helpers.jwTokenSign(user).catch(_jwtErr => {
          throw (500, 'Could not generate token', _jwtErr);
        });
      })
      .then(token => {
        responseBody['token'] = token;
        return Users.create(req.body.userProfile).fetch();
      })
      .then(userProfile => {
        console.log('TCL: userProfile', userProfile);
        return res.status(201).json({ ...responseBody, userProfile });
      })
      // eslint-disable-next-line handle-callback-err
      .catch(err => {
        if (req.body.userProfile.auth) {
          return Auth.destroyOne({ id: req.body.userProfile.auth })
            .then(_removeRes => {
              return res.status(400).json({
                errorMessage: err.message,
                errorName: err.name,
              });
            })
            .catch(removeErr => {
              return res.status(400).json({
                errorName: removeErr.name,
                errorMessage: removeErr.message,
              });
            });
        } else {
          res.status(400).json({
            errorName: err.name,
            errorMessage: err.message,
          });
        }
      });
  },
  login: async (req, res) => {
    return Auth.findOne({
      email: req.body.email,
    })
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: 'Failed to login',
            errorMessage: 'User account not found',
          });
        }
        req.user = user.toJSON();
        // TODO: move comparing passwords to service
        return bcrypt
          .compare(req.body.password, user.password)
          .then(matched => {
            if (matched) {
              return new Promise(resolve => resolve(user));
            } else {
              throw new Error('Invalid account credentials.');
            }
          });
      })
      .then(result => {
        return sails.helpers.jwTokenSign(result).catch(_jwtErr => {
          throw new Error('Could not generate token');
        });
      })
      .then(async token => {
        const userProfile = await Users.findOne({ auth: req.user.id });
        return res
          .status(200)
          .json({ token: token, user: req.user, userProfile });
      })
      .catch(err => {
        return res.status(400).json({
          errorMessage: err,
        });
      });
  },
};

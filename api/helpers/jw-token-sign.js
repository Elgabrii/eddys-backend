var jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Jw token sign',

  description: '',

  inputs: {
    payload: {
      type: {},
      friendlyName: 'User Payload',
      description: 'A reference to user payload to be signed.',
      required: true
    }
  },

  exits: {
    success: {
      description: 'All done.'
    }
  },

  fn: function(inputs) {
    // TODO:
    return jwt.sign(
      {
        user: inputs.payload
      },
      sails.config.jwtSecret,
      { expiresIn: sails.config.jwtExpiry }
    );
  }
};

var jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Verify JWT',
  description: 'Verify a JWT token.',
  inputs: {
    token: {
      type: 'string',
      friendlyName: 'JWToken',
      description: 'The token sent as [x-access-toke] header.',
      required: true
    }
  },
  exits: {
    invalid: {
      description: 'Invalid token or no authentication present.'
    }
  },
  fn: function(inputs, exits) {
    if (inputs.token) {
      // if there is something, attempt to parse it as a JWT token
      return jwt.verify(
        inputs.token,
        sails.config.jwtSecret,
        async (err, payload) => {
          if (err || !payload.user) return exits.invalid();
          var user = await Auth.findOne({ id: payload.user.id });
          if (!user) return exits.invalid();

          return exits.success(user);
        }
      );
    } else {
      // if neither a cookie nor auth header are present, then there was no attempt to authenticate
      return exits.invalid();
    }
  }
};

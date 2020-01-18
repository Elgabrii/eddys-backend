module.exports = async function(req, res, next) {
  const headerToken = req.headers['x-access-token'];
  if (!headerToken) {
    res.status(401).json({ message: 'Missing authentication token.' });
    return;
  }

  sails.helpers.jwTokenVerify(headerToken).switch({
    error: function(err) {
      return res.serverError(err);
    },
    invalid: function(err) {
      res.status(401).json(err);
    },
    success: function(user) {
      req.currentUser = user;
      return next();
    }
  });
};

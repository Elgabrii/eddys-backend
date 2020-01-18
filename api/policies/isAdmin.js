module.exports = async function(req, res, next) {
  if (req.currentUser.role === 'admin' || req.currentUser.role === 'super') {
    return next();
  } else {
    res.status(403).json({ message: 'You are not allowed admin access.' });
  }
};

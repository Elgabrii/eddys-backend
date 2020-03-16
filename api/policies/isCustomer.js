module.exports = async function (req, res, next) {
  if (req.currentUser.role === 'customer') {
    return next();
  } else {
    return res
      .status(403)
      .json({ message: 'You are not allowed customer access.' });
  }
};

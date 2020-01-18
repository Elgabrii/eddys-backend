module.exports = function(error, res) {
  console.error('TCL: error', error);
  return res.status(error.code).json({ ...error });
};

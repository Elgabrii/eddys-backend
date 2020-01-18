module.exports = (code, msg, name = null, userMessage = '') => {
  const customError = {
    ...new Error(),
    name: name || 'BadRequest',
    code: code || 500,
    message: msg || 'Something went wrong, but we can not tell what exactly.',
    userErr: true,
    userMessage
  };
  return customError;
};

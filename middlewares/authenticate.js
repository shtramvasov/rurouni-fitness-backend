module.exports = function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: 'Отказано в доступе' }); 
  }
};
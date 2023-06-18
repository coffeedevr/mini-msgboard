const addQuery = (req, res, next) => {
  req.query.page = req.query.page || 1
  req.query.order = req.query.order || 'desc'
  next();
}

const addUser = (req, res, next) => {
  res.locals.user = req.user;
  next();
}

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/log-in') // if not auth
}

const forwardAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/');  // if auth    
}

module.exports = { addQuery, addUser, ensureAuthenticated, forwardAuthenticated }
const { checkToken } = require('../modules/jwt');

module.exports = (request, response, next) => {
   let token = request.cookies?.adminko;
   if(!token) {
    response.redirect('/admin/login');
    return false
   }
   token = checkToken(token)
   if(!token) {
       response.redirect('/admin/login');
       return false
   }
   request.admin = token;
   next();
}
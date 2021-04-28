const { checkToken } = require('../modules/jwt');

module.exports = (request, response, next) => {
    let token = request.cookies.token;

    if(!token) {
        response.redirect('login');
        return false;
    }
    token = checkToken(token);
    if(!token) {
        response.redirect('login');
        return false;
    }
    request.user = token;
    next();
}
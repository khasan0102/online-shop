const router = require("express").Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get('/', AuthMiddleware, (request, response) => {
    response.render('index');
});




module.exports = {
    path: '/',
    router
}
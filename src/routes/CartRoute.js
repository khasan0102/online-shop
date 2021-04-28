const router = require("express").Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware");
router.get('/', AuthMiddleware, (request, response) => {
    response.render('cart')
});


router.post('/order', AuthMiddleware, (req, res) => {
   console.log(req.body)
});

module.exports = {
    path: "/cart",
    router
}
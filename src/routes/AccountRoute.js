const router = require("express").Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const { findUser } = require("../models/UserModel");
router.use(AuthMiddleware)
router.get('/', (req, res) => {
   res.render('account', {
       user: req.user
   });
});

router.get('/order', async (req, res) => {
    let user = await findUser(req.user.email);
    res.json({order: user.orders});
})

module.exports = {
    path: '/account',
    router
}
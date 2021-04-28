const router = require("express").Router();

router.get('/', (req, res) => {
   res.render('account');
});

module.exports = {
    path: '/account',
    router
}
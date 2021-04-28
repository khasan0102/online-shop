const router = require("express").Router();

router.get('/exit', (request, response) => {
    response.clearCookie('token').redirect('/login');
})

module.exports = {
    path: '/exit',
    router
}
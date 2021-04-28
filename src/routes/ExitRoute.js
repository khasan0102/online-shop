const router = require("express").Router();

router.get('/', (request, response) => {
    response.clearCookie('token').redirect('/login');
})

module.exports = {
    path: '/exit',
    router
}
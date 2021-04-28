const router = require("express").Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const { addOrder, findUser } = require("../models/UserModel");
const { checkCrypt } = require("../modules/bcrypt");
router.get("/", AuthMiddleware, (request, response) => {
    response.render("cart");
});

router.post("/order", AuthMiddleware, async (req, res) => {
    try {
        let user = await findUser(req.user.email);
        let carts = user.orders || [];
        let isTrust = checkCrypt(req.body.password, user.password);
        if (!isTrust) throw new Error("password incored");
        if (!req.body.cart) new Error("Bad request");
        for(let el of req.body.cart) 
            carts.push(el);
        let response = await addOrder(req.user.id, carts);
        res.json(response);
    } catch (e) {
        res.json({ ok: false, message: e + '' });
    }
});

module.exports = {
    path: "/cart",
    router,
};

const { Router } = require("express");
const router = Router();
const AdminMidlleware = require("../middlewares/AdminMiddleware");
const { findAdmin } = require("../models/ProductModels");
const Joi = require("joi");
const { checkCrypt } = require("../modules/bcrypt")
const { generateToken } = require("../modules/jwt")
const LoginValidation = new Joi.object({
    username: Joi.string()
             .min(3)
             .max(16)
             .required(),
    password: Joi.string()
                  .min(6)
                  .required()
})



router.get("/", AdminMidlleware, (req, res) => {
    res.render('admin/admin')
});


router.get('/login', (req, res) => {
    res.render('login', {
        admin: 'Admin'
    })
});


router.post('/login', async (request, response) => {
   try {
    let { login: username, password } = request.body;
    let data = await LoginValidation.validateAsync({username, password });
    let admin = await findAdmin(username);
    if(!admin) throw new Error("User is not defined");
    let isTrust = checkCrypt(data.password, admin.parol);
    if(!isTrust) throw new Error("Password incored");
    let obj = {
        message: 'What do you think'
    }
    let token = generateToken(obj);
    response.cookie('adminko', token).redirect('/admin');
    
   } catch (e) {
       if((e + '').includes('ValidationError:')) {
           e = (e + '').slice(16)
       } else if((e + '').includes('Error: querySrv ENODATA _mongodb._tcp.cluster0.lsiux.mongodb.net')) {
           e = 'Database Error'
       }
      response.render('login', {
          error: e +'',
          admin: 'Admin'
      })
   }
});

router.get('/addproduct', AdminMidlleware, (req, res) => {
    res.render('admin/addProducts')
});

router.get('/products', AdminMidlleware, (req, res) => {
    res.render('admin/products');
})

module.exports = {
    path: '/admin',
    router
}
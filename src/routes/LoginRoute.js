const router = require("express").Router();
const Joi = require('joi');
const { findUser } = require("../models/UserModel");
const { checkCrypt } = require("../modules/bcrypt");
const { generateToken } = require("../modules/jwt");
const LoginValidation = new Joi.object({
    login: Joi.string()
              .min(3)
              .max(40),
    password: Joi.string()
              .min(6)
              .required()
});

router.get('/', (req, res) => {
    res.render('login', {
        email: 'or Email',
    })
});

router.post("/", async (request, response) => {
   try {
       let data = await LoginValidation.validateAsync(request.body);
       let login = Number(data.login);
       let user
       if(isNaN(login)) {
            user = await findUser(data.login)
       }else{
           user = await findUser(login);
       }
       if(!user) throw new Error('User is not defined');
       let isTrust = checkCrypt(data.password, user.password);
       if(!isTrust) throw new Error('Password incored');
       let token = {
        id: user._id,
        fullName: user.full_name,
        email: user.email,
        phoneNumber: user.phone_number 
       };
       token = generateToken(token);
       response.cookie('token', token).redirect('/');
   } catch (e) {
       console.log(e)
       if((e + '').includes("ValidationError")) {
         e = (e + '').slice(16);
       }
       if((e + '').includes("Error")) {
        e = (e + '').slice(6);
      }

      response.render('login', {
        title: "Signup",
        email: "or Email",
        error: e + ''
    })
   }
});

module.exports = {
    path: '/login',
    router
}
const router = require("express").Router();
const Joi = require('joi');
const { generateCrypt } = require("../modules/bcrypt");
const { makeUser } = require("../models/UserModel");
const { generateToken } = require("../modules/jwt");

const RegistrationValidation = new Joi.object({
   email: Joi.string()
             .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
             .required(),
   phone_number: Joi.number()
                    .min(10000)
                    .max(100000000000000)
                    .required(),
    full_name: Joi.string()
                  .required()
                  .min(3)
                  .max(40),
    password: Joi.string()
                 .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

router.get('/', (request, response) => {
   response.render('registration')
});

router.post("/", async (request, response) => {
   try {
       let {email, phone_number, full_name, password } = await RegistrationValidation.validateAsync(request.body);
       let user = await makeUser(email, phone_number, full_name, generateCrypt(password));
       let token = {
           id: user._id,
           fullName: user.full_name,
           email: user.email,
           phoneNumber: user.phone_number
       };
       token = generateToken(token);
       response.cookie('token', token).redirect('/');
   } catch (e) {
       if((e + '').includes("duplicate key")){
        e = 'Phone or username is not available'
       }
       if((e + '').includes("ValidationError")) {
         e = (e + '').slice(16);
       }
       if((e + '').includes("Error")) {
        e = (e + '').slice(6);
      }
       response.render('registration', {
        title: "Signup",
        error: e + ''
    })
   }
});
module.exports = {
    path: '/signup',
    router
}
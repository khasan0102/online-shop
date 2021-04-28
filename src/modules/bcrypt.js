const bcrypt = require("bcrypt");
const { editProduct } = require('../models/ProductModels');

let generateCrypt = (data) => {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(data, salt);
}

let checkCrypt = (data, hash) => {
    return bcrypt.compareSync(data, hash);
};


module.exports = {
  generateCrypt, checkCrypt
}



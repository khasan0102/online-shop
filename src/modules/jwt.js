const path = require('path');
const { sign, verify } = require('jsonwebtoken');
require('dotenv').config({ path: path.join(__dirname, '..', '..','.env')});


const generateToken = (data) => {
    return sign(data, process.env.SECRET_WORD);
}

const checkToken = (data) => {
    try {
        return verify(data, process.env.SECRET_WORD)
    } catch (e) {
        return false
    }
}


module.exports = {
    generateToken,  checkToken
}

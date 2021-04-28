const mongoose = require('mongoose')
const path = require('path');
const { editProduct } = require("../models/ProductModels");

require('dotenv').config({ path: path.join(__dirname, '..', '..','.env')});

async function client() {
    return await mongoose.connect(process.env.ATLAS_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}


module.exports = client;

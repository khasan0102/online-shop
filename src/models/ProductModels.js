const client = require("../modules/client");
const Schema = require("mongoose").Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category_id: {
        type: Number,
        required: true
    },
    img_path: {
        type: String,
        required: true
    }
});


async function ProductModel() {
    let db = await client();
    return await db.model('products', ProductSchema);
}


const AdminSchema = Schema({
    login: {
        type: String,
        required: true
    },
    parol: {
        type: String
    }
})



async function AdminModel() {
    let db = await client();
    return await db.model('admin', AdminSchema);
}

async function findAdmin(login) {
   let db = await AdminModel();
   return await db.findOne({login});
}


async function addProduct(name, price, img_path, category_id) {
    let db = await ProductModel();
    return await db.create({name, price, category_id, img_path});
}

async function getProducts (element = {}) {
    let db = await ProductModel();
    return await db.find(element);
}

async function editProduct(id, price) {
    let db = await ProductModel();
    return await db.updateOne({_id: id}, {price});
}

async function deleteProduct(id) {
    let db = await ProductModel();
    return await db.deleteOne({_id: id});
}
module.exports = {
    addProduct, findAdmin, getProducts,
    editProduct, deleteProduct
}
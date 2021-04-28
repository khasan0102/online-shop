const client = require("../modules/client");
const Schema = require("mongoose").Schema;

const OrderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    allPrice: {
        type: Number,
        required: true
    },
    imgPath: {
        type: String
    },
    productId: {
        type: String,
        required: true
    }
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    orders: [OrderSchema]
});

async function UserModel() {
    let db = await client();
    return await db.model('users', UserSchema);
}


async function makeUser(email, phone_number, full_name, password) {
    let db = await UserModel();
    return db.create({email, full_name, phone_number, full_name, password});
}

async function findUser(login) {
   let obj = (typeof login === "string") ? {email: login} : {phone_number: login};
   let db = await UserModel();
   return await db.findOne(obj);
} 

async function getUsers() {
    let db = await UserModel();
    return await db.find({});
}

async function addOrder(id, orders){
    let db = await UserModel();
    return await db.updateMany({_id: id}, {orders})
}
module.exports = {
    makeUser, findUser,
    getUsers, addOrder
}

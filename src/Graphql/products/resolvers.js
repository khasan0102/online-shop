const Joi = require("joi");
const { createWriteStream } = require("fs");
const {
    addProduct,
    getProducts,
    editProduct,
    deleteProduct
} = require("../../models/ProductModels");
const fetch = require("node-fetch");
const path = require("path");
const ProductValidation = new Joi.object({
    name: Joi.string().min(3),
    price: Joi.number().required(),
    imgUrl: Joi.string().min(7).required(),
    categoryId: Joi.number().min(1).max(4),
});

module.exports = {
    Query: {
        products: async () => await getProducts(),
        categoryProducts: async (_, { categoryId }) =>
            await getProducts({ category_id: categoryId }),
    },
    Product: {
        id: (global) => global._id,
        imgPath: (global) => global.img_path,
        categoryId: (global) => global.category_id,
    },
    //Mutation
    Mutation: {
        addProduct: async (_, { name, price, categoryId, imgUrl }) => {
            try {
                let data = await ProductValidation.validateAsync({
                    name,
                    price,
                    imgUrl,
                    categoryId,
                });
                let imgName = data.name.split(" ").join("");

                let imgPath = path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    imgName + ".jpg"
                );
                const file = createWriteStream(imgPath);
                let response = await fetch(data.imgUrl);
                await response.body.pipe(file);
                let res = await addProduct(
                    name,
                    price,
                    `/images/${imgName}.jpg`,
                    categoryId
                );
                return {
                    status: 200,
                    message: "ok",
                };
            } catch (e) {
                return {
                    status: 400,
                    message: e + "",
                };
            }
        },
        editProduct: async (_, { id, price, imgUrl }) => {
            try {
                let products = await getProducts({ _id: id });
                let product = products[0];
                let imgName = product.name.split(" ").join("");
                let imgPath = path.join(
                    __dirname,
                    "..",
                    "..",
                    "public",
                    "images",
                    imgName + ".jpg"
                );
                const file = createWriteStream(imgPath);
                let response = await fetch(imgUrl);
                await response.body.pipe(file);
                let res = await editProduct(product._id, price);
                if(res.ok) {
                    return {
                        status: 201,
                        message: "changed"
                    }
                }else {
                    return {
                        status: 400,
                        message: 'ba request'
                    }
                }
            } catch (e) {}
        },

        deleteProduct: async (_, {id}) => {
            let res = await deleteProduct(id);
            if(res.ok) {
                return {
                    status: 201,
                    message: "Deleted Product"
                }
            }
        }
    },
};

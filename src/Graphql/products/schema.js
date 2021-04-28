const { gql } = require("apollo-server-express");

module.exports = gql`
   extend type Query {
       products: [Product!]!
       categoryProducts(categoryId: Int!): [Product!]!
   }
  
   type Product {
       id: String!
       name: String!
       price: Int!
       categoryId: Int!
       imgPath: String!
   }
   type PostResponse {
       status: Int
       message: String
   }
   
   ## Mutation

   extend type Mutation {
       addProduct(name: String!, price: Int!, categoryId: Int!, imgUrl: String!): PostResponse,
       deleteProduct(id: String!): PostResponse,
       editProduct(id: String!, price: Int!, imgUrl: String!): PostResponse  
   } 
`
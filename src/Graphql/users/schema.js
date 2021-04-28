const { gql } = require("apollo-server-express");

module.exports = gql`
   extend type Query {
       users: [User!]!
   }
  
   type User {
       email: String!
       phone_number: Int!
       full_name: String!
       orders: [Order!]
   }
   
   type Order {
       name: String!
       count: Int!
       price: Int!
       all_price: Int!
       product_id: Int!
       user_id: String!
   }   
`
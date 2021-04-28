const { getUsers } = require("../../models/UserModel")
module.exports = {
    Query: {
        users: () => getUsers()
    },
    
    Mutation: {
        
    }
}
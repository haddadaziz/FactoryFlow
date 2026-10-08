const User = require('../models/User.js');

class UserRepository{
    async createUser(data,session = null){

        const user = new User(data);
        return await user.save({session});
    };

    async findByEmail(email){
        return await User.findOne({email});
    };

    async countUsers(){
        return await User.countDocuments();
    };

    async findById(id){
        return await User.findById(id);
    };
};
module.exports = new UserRepository();
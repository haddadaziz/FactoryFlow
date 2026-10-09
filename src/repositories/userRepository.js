const User = require('../models/User.js');

class UserRepository{
    async createUser(data,session = null){

        const user = new User(data);
        return await user.save({session});
    };

    async findByEmail(email){
        return await User.findOne({email});
    };

    async findByEmailWithPassword(email){
        return await User.findOne({email}).select('+password');
    }

    async countUsers(){
        return await User.countDocuments();
    };

    async findById(id){
        return await User.findById(id);
    };

    async updateUser(id,updateData){
        return await User.findByIdAndUpdate(id,updateData,{
            new: true,
            runValidators: true
        });
    }

    async getAllUsers(){
        return await User.find();
    }
};
module.exports = new UserRepository();
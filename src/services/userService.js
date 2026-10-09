const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const userRepository = require('../repositories/userRepository');

class UserService{
    async createUser(userData){
        const existingUser = await userRepository.findByEmail(userData.email);
        if(existingUser && existingUser.email === userData.email){
            throw new AppError('Un utilisateur avec cet email exite deja',400);
        }
        const hashedPassword = await bcrypt.hash(userData.password,12);

        const newUser = await userRepository.createUser({
            name: userData.name,
            email: userData.email,
            role: userData.role || 'operator',
            password: hashedPassword
        });

        return {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    }

    async getAllUsers() {
        return await userRepository.getAllUsers();
    }
}

module.exports = new UserService();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const userRepository = require('../repositories/userRepository');

class authService {

    generateToken(user) {
        return jwt.sign({
            id: user._id, role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '4h' });
    };

    async login(email, password) {
        const user = await userRepository.findByEmailWithPassword(email);

        if (!user) throw new AppError('Email ou mot de passe incorrect', 401);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new AppError('Mot de passe incorrect', 401);

        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

    }

    async updateMe(userId, { name, email }) {
        const updateData = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;

        if (email) {
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                throw new AppError('Cet email est deja utilise par un autre comptre', 400);
            }
        };

        const updateUser = await userRepository.updateUser(userId, updateData);

        return {
            id: updateUser.id,
            name: updateUser.name,
            email: updateUser.email,
            role:updateUser.role
        };

    }

}

module.exports = new authService();
const AppError = require('../utils/AppError');
const userService = require('../services/userService');

class UserController {
    async createUser (req, res, next) {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return next(new AppError('Champs obligatoires manquants', 400));
        }
        try {
            const data = await userService.createUser({
                name,
                email,
                password,
                role
            })

            return res.status(201).json({ status: 'success', data });
        } catch (e) {
            next(e);
        }
    }

    async getAllUsers (req, res, next) {
        try {
            const data = await userService.getAllUsers();
            res.status(200).json({ status: 'success', data });
        } catch (e) {
            next(e);
        }
    }
};

module.exports = new UserController();
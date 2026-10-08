const InstallationRepository = require('../repositories/installationRepository.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError.js');
const userRepository = require('../repositories/userRepository.js');

class InstallationService {

    async checkInstallationStatus() {
        const installation = await InstallationRepository.getInstallation();
        if (installation) {
            return {
                isInstalled: true,
                installedAt: installation.installedAt
            };
        }

        return {
            isInstalled: false
        };
    };

    async installApp({ name, email, password }) {
        const isAlreadyInstalled = await InstallationRepository.getInstallation();

        if (isAlreadyInstalled) throw new AppError("l'application est deje installe. reinitialisation refusée", 400);

        const hashedPassword = await bcrypt.hash(password, 12);

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const admin = await userRepository.createUser({
                name,
                email,
                password: hashedPassword,
                role: 'admin'
            }, session);
            const installation = await InstallationRepository.createInstallation({
                isInstalled: true,
                installedBy: admin._id,
                installedAt: new Date()
            }, session);

            await session.commitTransaction();

            return {
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                },
                installedAt: installation.installedAt
            };
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    }
};

module.exports = new InstallationService();
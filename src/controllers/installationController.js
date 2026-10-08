const installationService = require('../services/installationService.js');
const AppError = require('../utils/AppError.js');

class InstallationController {
    async getStatus(req, res, next) {
        try {
            const data = await installationService.checkInstallationStatus();
            res.status(200).json({ status: 'succes', data });
        } catch (e) {
            next(e);
        }
    };

    async install(req,res,next){
        try{
            const {name,email,password} = req.body;

            if(!name || !password || !email) return next(new AppError('Veuillez fournir un nom, un email et un mdp',400));

            const data = await installationService.installApp({name,email,password});

            res.status(201).json({status:'success',data});
        }catch(e){
            next(e);
        }
    }
};

module.exports = new InstallationController();
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const protect = async (req,res,next)=>{
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];

        if(!token) return next(new AppError(`Vous n'êtes pas connecté.Veuillez fournir un token`,401));
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userRepository.findById(decoded.id);
        if(!user) return next(new AppError('L utilisateur associé a ce token n exist pas',401));

        req.user = user;
        next();
    }catch(e){
        next(new AppError('Token invalide ou expiré',401))
    }
}

module.exports = {protect};
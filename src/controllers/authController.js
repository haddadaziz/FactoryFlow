const authService = require('../services/authService');
const AppError = require('../utils/AppError');

class AuthController{
    async login(req,res,next){
        try{
            const {email, password} = req.body;
            if(!email || !password) return next(new AppError('Login impossible',400));
            const data = await authService.login(email,password);
            return res.status(200).json({status: 'success', data});
        }catch(e){
            next(e);
        }
    }

    async getMe(req,res,next){
        res.status(200).json({
            status:'success',
            data:{
                user:{
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role
                }
            }
        });
    }

    async updateMe(req,res,next){
        try{ 
            const data = await authService.updateMe(req.user._id,req.body);
            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        }
    }
}
module.exports = new AuthController();
const AppError = require('../utils/AppError');
const productService = require('../services/productService');

class ProductController{
    async create(req,res,next){
        try{
            const {reference,name,composition} = req.body;

            if(!reference || !name || !composition) return next(new AppError('Les champs sont obligatoires',400));

            const data = await productService.createProduct({reference,name,composition});

            return res.status(201).json({status:'success',data});
        }
        catch(e){
            next(e);
        }
    };

    async getAll(req,res,next){
        try{
            const data = await productService.getAllProducts(req.query);

            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        }
    };

    async getById(req,res,next){
        try{
            const data = await productService.getProductById(req.params.id);
            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        }
    };

    async update(req,res,next){
        try{
            const data = await productService.updateProduct(req.params.id,req.body);
            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        }
    };
    async delete(req,res,next){
        try{
            const data = await productService.deleteProduct(req.params.id);
            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        }
    };
};

module.exports = new ProductController();
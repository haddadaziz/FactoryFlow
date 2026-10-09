const AppError = require('../utils/AppError');
const rawMaterialService = require('../services/rawMaterialService');

class RawMaterialController {
    async create(req, res, next) {
        const {reference,name,unit,alertThreshold} = req.body;
        if (!reference || !name || !unit) return next(new AppError('Des champs obligatoires sont vides', 400));

        try {
            const data = await rawMaterialService.createRawMaterial({
                reference,
                name,
                unit,
                alertThreshold
            });

            return res.status(201).json({
                status:'success',
                data
            });
        } catch (e) {
            next(e)
        }
    };

    async getAll(req, res, next) {
        try{
            const data = await rawMaterialService.getAllRawMaterials(req.query);
            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        }
    };

    async getById(req, res, next) {
        try{
            const data = await rawMaterialService.getRawMaterialById(req.params.id);
            return res.status(200).json({status: 'success',data});
        }catch(e){
            next(e);
        }
    };

    async update(req,res,next){
        try{
            const {reference,name,unit,alertThreshold} = req.body;
            const data = await rawMaterialService.updateRawMaterial(req.params.id,{reference,name,unit,alertThreshold});
            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        }
    };

    async delete(req,res,next){
        try{
            await rawMaterialService.deleteRawMaterial(req.params.id);
            return res.status(200).json({status:'success',message: 'matiere supprimee avec success'});
        }catch(e){
            next(e);
        }
    };
}

module.exports = new RawMaterialController();
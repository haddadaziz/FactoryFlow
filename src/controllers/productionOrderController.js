const AppError = require('../utils/AppError');
const productionOrderService = require('../services/productionOrderService');

class ProductionOrderController {
    async create(req, res, next) {
        try {
            const { reference, productId, assignedOperatorId, quantityToProduce } = req.body;

            if (!reference || !productId || !assignedOperatorId || !quantityToProduce) return next(new AppError('Empty Values', 400))

            const data = await productionOrderService.createOrder({
                reference: reference,
                productId: productId,
                assignedOperatorId,
                quantityToProduce
            });
            return res.status(201).json({ status: 'success', data });
        } catch (e) {
            next(e);
        }

    };

    async start(req, res, next) {
        try {
            const data = await productionOrderService.startOrder(req.params.id, req.user._id);
            return res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    };

    async finish(req, res, next) {
        try {
            const data = await productionOrderService.finishOrder(req.params.id,req.user._id);


            return res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    };

    async cancel(req, res, next) {
        try {
            const data = await productionOrderService.cancelOrder(req.params.id);
            return res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e);
        }
    };

    async getAll(req,res,next){
        try{
            const filters = {...req.query};

            if(req.user.role === 'operator'){
                filters.assignedOperatorId = req.user._id
            }
            const data = await productionOrderService.getAllOrders(filters);
            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        };
    };

    async getById(req,res,next){
        try{
            const data = await productionOrderService.getOrderById(req.params.id);
            if(!data) throw new AppError('Ordre de Fabrication introuvable',404);
            
            if(req.user.role === 'operator' && req.user._id.toString() != data.assignedOperatorId._id.toString() ){
                throw new AppError('Vous n avez pas acces a cet ordre de fabrication',403);
            }
            return res.status(200).json({status:'success',data});
        }catch(e){
            next(e);
        }
    }
};

module.exports = new ProductionOrderController();
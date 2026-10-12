const StockMovement = require('../models/StockMovement');

class StockMovementRepository{
    async create(data,session = null){
        const stockMovement = new StockMovement(data);

        return await stockMovement.save({session});
    };

    async findAll(filter = {}){
        return await StockMovement.find(filter).sort({createdAt: -1}).populate('materialId','reference name').populate('performedByUserId','name email');
    };

    async findByMaterialId(materialId){
        return await StockMovement.find({materialId}).sort({createdAt: -1}).populate('materialId','reference name unit').populate('performedByUserId','name email');
    }
}

module.exports = new StockMovementRepository();
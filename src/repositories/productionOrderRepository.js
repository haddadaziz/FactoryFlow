const ProductionOrder = require('../models/ProductionOrder');

class ProductionOrderRepository{
    async create(data,session = null){
        const productionOrder = new ProductionOrder(data);
        return await productionOrder.save({session});

    };

    async findAll(filter = {}){
        return await ProductionOrder.find(filter).sort({createdAt: -1}).populate('productId','reference name').populate('assignedOperatorId','name email').populate('compositionSnapshot.materialId','reference name unit');
    };
    async findById(id){
        return await ProductionOrder.findById(id).populate('productId','reference name').populate('assignedOperatorId','name email').populate('compositionSnapshot.materialId','reference name unit');
    };
    async findByReference(reference){
        return await ProductionOrder.findOne({reference}).populate('productId','reference name').populate('assignedOperatorId','name email').populate('compositionSnapshot.materialId','reference name unit');
    };

    async update(id,updateData,session = null){
        return await ProductionOrder.findByIdAndUpdate(id,updateData,{new:true,runValidators:true,session});
    };

    async delete(id){
        return await ProductionOrder.findByIdAndDelete(id);
    };
}

module.exports = new ProductionOrderRepository();
const ProductionOrder = require('../models/ProductionOrder');

class ProductionOrderRepository {
    async create(data, session = null) {
        const productionOrder = new ProductionOrder(data);
        return await productionOrder.save({ session });

    };

    async findAll(filter = {}) {
        const page = Number(filter.page) || 1;
        const limit = Number(filter.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};

        if (filter.status) query.status = filter.status.toUpperCase();

        if (filter.productId) query.productId = filter.productId;

        if (filter.assignedOperatorId) query.assignedOperatorId = filter.assignedOperatorId;

        if (filter.startDate || filter.endDate) { 
            query.createdAt = {};
            if(filter.startDate) query.createdAt.$gte = new Date(filter.startDate);
            if(filter.endDate) query.createdAt.$lte = new Date(filter.endDate);
        }

        const [orders,total] = await Promise.all([
            ProductionOrder.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate('productId','reference name').populate('assignedOperatorId','name email').populate('compositionSnapshot.materialId','reference name unit'),
            
            ProductionOrder.countDocuments(query)
        ])

        return {
            orders,
            pagination:{
                total,
                page,
                totalPages: Math.ceil(total/limit),
                limit
            }
        }
    };
    async findById(id) {
        return await ProductionOrder.findById(id).populate('productId', 'reference name').populate('assignedOperatorId', 'name email').populate('compositionSnapshot.materialId', 'reference name unit');
    };
    async findByReference(reference) {
        return await ProductionOrder.findOne({ reference }).populate('productId', 'reference name').populate('assignedOperatorId', 'name email').populate('compositionSnapshot.materialId', 'reference name unit');
    };

    async update(id, updateData, session = null) {
        return await ProductionOrder.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, session });
    };

    async delete(id) {
        return await ProductionOrder.findByIdAndDelete(id);
    };
}

module.exports = new ProductionOrderRepository();
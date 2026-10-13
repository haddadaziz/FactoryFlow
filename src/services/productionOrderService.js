const productionOrderRepository = require('../repositories/productionOrderRepository');
const AppError = require('../utils/AppError');
const productRepository = require('../repositories/productRepository');
const userRepository = require('../repositories/userRepository');
const rawMaterialRepository = require('../repositories/rawMaterialRepository');
const mongoose = require('mongoose');
const stockMovementRepository = require('../repositories/stockMovementRepository');

class ProductionOrderService {
    async createOrder({ reference, productId, assignedOperatorId, quantityToProduce }) {
        const ref = await productionOrderRepository.findByReference(reference);
        if (ref) throw new AppError('Reference deja existance', 400);

        const prod = await productRepository.findById(productId);
        if (!prod) throw new AppError('Le produit n existe pas', 404);

        const operator = await userRepository.findById(assignedOperatorId);
        if (!operator) throw new AppError('Operateur inexsitant', 404);

        const compositionSnapshot = prod.composition.map(item => ({
            materialId: item.materialId._id,
            quantity: item.quantity
        }));
        const data = {
            reference: reference,
            productId: productId,
            assignedOperatorId: assignedOperatorId,
            quantityToProduce: quantityToProduce,
            status: 'PLANIFIE',
            compositionSnapshot: compositionSnapshot
        }
        return await productionOrderRepository.create(data);
    };

    async startOrder(orderId, authenticateUserId) {
        const order = await productionOrderRepository.findById(orderId);
        if (!order) throw new AppError('ordre inexsitant', 404);

        if (!order.canBeStarted()) throw new AppError('seul un ordre planifie peut etre demarre',400);

        if(order.assignedOperatorId._id.toString() !== authenticateUserId.toString()){
            throw new AppError('Vous ne pouvez pas demarrer l ordre d un autre operateur',403);
        }

        const requirements = order.calculateMaterialRequirements();


        for (const req of requirements) {
            const mat = await rawMaterialRepository.findById(req.materialId);
            if (!mat || !mat.hasSufficientStock(req.quantityRequired)) throw new AppError(`stock insuffisant pour ${mat.name}`, 400)
        };

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            for (const req of requirements) {

                const mat = await rawMaterialRepository.findById(req.materialId);
                const newStock = mat.currentStock - req.quantityRequired;

                await rawMaterialRepository.update(req.materialId, { currentStock: newStock }, session);

                await stockMovementRepository.create({
                    type: 'SORTIE',
                    materialId: req.materialId,
                    quantity: req.quantityRequired,
                    reason: `Consommation Ordre De fabrication ${order.reference}`,
                    performedByUserId: authenticateUserId,
                    orderId: order._id
                }, session);
            }
            const updatedOrder = await productionOrderRepository.update(orderId, {
                status: 'EN_COURS',
                startDate: new Date()
            }, session);

            await session.commitTransaction();
            return updatedOrder
        } catch (e) {
            await session.abortTransaction();
            throw e
        } finally {
            await session.endSession()
        }
    };

    async finishOrder(orderId,authenticateUserId) {
        const order = await productionOrderRepository.findById(orderId);
        if (!order.canBeFinished()) throw new AppError('Seul un ordre EN_COURS peut etre terminé', 400);

        if(order.assignedOperatorId._id.toString() != authenticateUserId.toString()){
            throw new AppError('Impossible de terminer un ordre qui ne vous appartient pas',403);
        }

        const data = {
            status: 'TERMINE',
            endDate: new Date()
        }
        return await productionOrderRepository.update(orderId, data)
    };

    async cancelOrder(orderId) {
        const order = await productionOrderRepository.findById(orderId);
        if (!order.canBeCancelled()) throw new AppError('Impossible d annuler cet order', 400);

        return await productionOrderRepository.update(orderId, { status: 'ANNULE', endDate: new Date() })
    };

    async getAllOrders(filters) {
        return await productionOrderRepository.findAll(filters);
    };

    async getOrderById(id) {
        return await productionOrderRepository.findById(id);
    };
}

module.exports = new ProductionOrderService();
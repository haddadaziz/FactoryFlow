const StockMovement = require('../models/StockMovement');
const rawMaterialRepository = require('../repositories/rawMaterialRepository');
const stockMovementRepository = require('../repositories/stockMovementRepository');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');

class StockMovementService {
    async createMovement(type, materialId, quantity, reason, performedByUserId) {
        const mat = await rawMaterialRepository.findById(materialId);
        if (!mat) throw new AppError('Matiere premiere introuvable', 404);
        let newStock = mat.currentStock;

        if (type === 'SORTIE' && !mat.hasSufficientStock(quantity)) {
            throw new AppError('Stock insuffisant pr effectuer cette sortie', 400);
        }

        if (type === 'ENTREE') {
            newStock += quantity
        }
        else {
            newStock -= quantity
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const data = {
                type,
                materialId,
                quantity,
                reason,
                performedByUserId
            }
            const movement = await stockMovementRepository.create(data, session);
            const updatedMaterial = await rawMaterialRepository.update(materialId, { currentStock: newStock }, session);
            await session.commitTransaction();
            return { movement, updatedMaterial }
        } catch (e) {
            await session.abortTransaction();
            throw e;
        }
        finally {
            await session.endSession();
        }
    }
    async getAllMovements(filters) {
        return await stockMovementRepository.findAll(filters);
    }

    async getMovementByMateriel(materialId) {
        return await stockMovementRepository.findByMaterialId(materialId);
    }
}

module.exports = new StockMovementService();
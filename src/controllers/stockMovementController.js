const stockMovementService = require('../services/stockMovementService');
const AppError = require('../utils/AppError');

class StockMovementController {
    async create(req, res, next) {

        try {
            const { type, materialId, quantity, reason } = req.body;

            if (!type || !materialId || !quantity || !reason)
                return next(new AppError('Champs obligatoires manquants', 400));

            const qty = Number(quantity);
            if (isNaN(qty) || qty <= 0) {
                return next(new AppError('La quantite doit etre superieure a 0', 400));
            }

            if (type.toUpperCase() != 'ENTREE' && type.toUpperCase() != 'SORTIE') throw new AppError('seule les entree et sortie sont autorisées',400);

            const data = await stockMovementService.createMovement(type.toUpperCase(), materialId, Number(quantity), reason, req.user._id);
            return res.status(201).json({ status: 'success', data });
        } catch (e) {
            next(e);
        }
    }

    async getAll(req, res, next) {
        try {
            const data = await stockMovementService.getAllMovements(req.query);
            return res.status(200).json({ status: 'success', data });
        }
        catch (e) {
            next(e)
        }
    }

    async getByMaterialId(req, res, next) {
        try {
            const data = await stockMovementService.getMovementByMateriel(req.params.materialId);
            return res.status(200).json({ status: 'success', data });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new StockMovementController();
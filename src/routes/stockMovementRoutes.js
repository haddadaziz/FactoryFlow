const express = require('express');
const router = express.Router();

const stockMovementController = require('../controllers/stockMovementController');

const {protect} = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/',stockMovementController.create);

router.get('/',stockMovementController.getAll)

router.get('/material/:materialId',stockMovementController.getByMaterialId)

module.exports = router;
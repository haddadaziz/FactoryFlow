const express = require('express');
const router = express.Router();

const {protect,restrictTo} = require('../middlewares/authMiddleware');
const productionOrderController = require('../controllers/productionOrderController');

router.use(protect);

router.post('/',restrictTo('admin'),productionOrderController.create);

router.get('/',productionOrderController.getAll);
router.get('/:id',productionOrderController.getById)

router.patch('/:id/start',productionOrderController.start);
router.patch('/:id/finish',productionOrderController.finish);
router.patch('/:id/cancel',restrictTo('admin'),productionOrderController.cancel);


module.exports = router;
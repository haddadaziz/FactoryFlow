const express = require('express');
const router = express.Router();
const {protect,restrictTo} = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');

router.use(protect);

router.get('/',productController.getAll);
router.get('/:id',productController.getById);

router.post('/',restrictTo('admin'),productController.create);
router.put('/:id',restrictTo('admin'),productController.update);
router.delete('/:id',restrictTo('admin'),productController.delete);

module.exports = router;


const express = require('express');
const router = express.Router();

const rawMaterialController = require('../controllers/rawMaterialController');
const {protect,restrictTo} = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/',restrictTo('admin'),rawMaterialController.create);
router.put('/:id',restrictTo('admin'),rawMaterialController.update);
router.delete('/:id',restrictTo('admin',),rawMaterialController.delete);

router.get('/',rawMaterialController.getAll);
router.get('/:id',rawMaterialController.getById);

module.exports = router;


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {protect,restrictTo} = require('../middlewares/authMiddleware');

router.use(protect,restrictTo('admin'));

router.post('/',userController.createUser);
router.get('/',userController.getAllUsers);

module.exports = router;


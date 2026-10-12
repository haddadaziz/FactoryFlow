const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: { values: ['ENTREE', 'SORTIE'] },
        uppercase:true,
        required:true
    },
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RawMaterial',
        required:true
    },
    quantity: {
        type: Number,
        min: [0.001, 'La quantité doit être supérieure à 0'],
        required:true
    },
    reason: {
        type: String,
        trim: true,
        required:true
    },
    performedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductionOrder',
        default:null
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('StockMovement',stockMovementSchema);
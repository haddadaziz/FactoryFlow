const mongoose = require('mongoose');

const productionOrderSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            unique: true,
            uppercase: true,
            trim: true,
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        assignedOperatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        quantityToProduce: {
            type: Number,
            required: true,
            min: 1
        },
        status: {
            type: String,
            enum: { values: ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'] },
            default: 'PLANIFIE',
            uppercase: true
        },
        compositionSnapshot: [
            {
                materialId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'RawMaterial',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }],
        startDate: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    },
);

productionOrderSchema.methods.canBeStarted = function () {
    return this.status === 'PLANIFIE'
};
productionOrderSchema.methods.canBeFinished = function () {
    return this.status === 'EN_COURS'
};
productionOrderSchema.methods.canBeCancelled = function () {
    return this.status === 'EN_COURS' || this.status === 'PLANIFIE'
};
productionOrderSchema.methods.calculateMaterialRequirements = function(){
    return this.compositionSnapshot.map(item=>({
        materialId: item.materialId._id || item.materialId,
        quantityRequired: item.quantity * this.quantityToProduce
    }));
}
module.exports = mongoose.model('ProductionOrder', productionOrderSchema);
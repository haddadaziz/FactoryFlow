const mongoose = require('mongoose');

const compositionItemSchema = new mongoose.Schema(
    {
        materialId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RawMaterial',
            required: true
        },
        quantity: {
            type: Number,
            min: [0.001, 'La quantite doit etre superieure a 0'],
            required: true
        },
    },
    {
        _id: false
    }
)

const productSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        composition: {
            type: [compositionItemSchema],
            required: true,
            validate: [
                {
                    validator: function (val) {
                        return Array.isArray(val) && val.length > 0;
                    },
                    message: 'La composition doit contenir au moins un materiel'
                },
                {
                    validator: function(val){
                        const ids = val.map(item => item.materialId.toString());
                        return ids.length === new Set(ids).size;
                    },
                    message : 'Un materiel ne peut pas apparaitre plusieurs fois dans la recette'
                }
            ]
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product',productSchema);
module.exports = Product;
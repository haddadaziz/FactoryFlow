const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            unique: true,
            trim:true,
            minlength:2,
            required:true,
            uppercase:true
        },
        name: {
            type: String,
            unique:true,
            trim: true,
            minlength: 2,
            required:true
        },
        unit : {
            type: String,
            trim:true,
            required:true,
            enum: {values:['kg','g','L','ml','pièce','piece']}
            
        },
        currentStock:{
            type: Number,
            required:true,
            default:0,
            min:0
        },
        alertThreshold:{
            type: Number,
            required:true,
            min:0,
            default:0
        },
    },
    {
        timestamps:true
    }
);

rawMaterialSchema.methods.isLowStock = function(){
    return this.currentStock <= this.alertThreshold;
};

rawMaterialSchema.methods.hasSufficientStock = function(quantity){
    return this.currentStock >= quantity;
};

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true,'Le nom est obligatoire'],
            trim : true,
            minlength: 2
        },
        email:{
            type: String,
            required: [true,"L'email est obligaoire"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password:{
            type: String,
            required: [true,'Le mot de passe est obligatoire'],
            minlength:6,
            select:false
        },
        role:{
            type: String,
            enum: {values: ['admin','operator'], message: 'Le role doit etre admin ou operator'},
            default: 'operator'
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('User',userSchema);
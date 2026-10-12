const Product = require('../models/Product');


class ProductRepository{
    async create(data,session =null){
        const product = new Product(data);
        return await product.save({session});
    };

    async findAll(filter = {}){
        return await Product.find(filter).populate('composition.materialId','reference name unit')
    };

    async update(id,updateData,session = null){
        return await Product.findByIdAndUpdate(id,updateData,{new:true,runValidators:true,session}).populate('composition.materialId','reference name unit');
    };

    async delete(id){
        return await Product.findByIdAndDelete(id);
    };

    async findById(id){
        return await Product.findById(id).populate('composition.materialId','reference name unit');
    };

    async findByReference(reference){
        return await Product.findOne({reference}).populate('composition.materialId','reference name unit');
    }
};

module.exports = new ProductRepository();
const RawMaterial = require('../models/RawMaterial');

class RawMaterialRepository{
    async create(data,session=null){
        const rawMaterial = new RawMaterial(data);

        return await rawMaterial.save({session});
    }

    async findAll(filter = {}){
        return await RawMaterial.find(filter);
    }

    async findById(id){
        return await RawMaterial.findById(id);
    }

    async findByReference(reference){
        return await RawMaterial.findOne({reference});
    }

    async update(id,updateData, session = null){
        return await RawMaterial.findByIdAndUpdate(id,updateData,{new:true,runValidators: true,session});
    };

    async delete(id){
        return await RawMaterial.findByIdAndDelete(id);
    };

    async findLowStock(){
        return await RawMaterial.find({
            $expr: {$lte:
                ['$currentStock','$alertThreshold']
            }
        }
        )
    }
};

module.exports = new RawMaterialRepository();
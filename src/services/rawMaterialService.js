const rawRepository = require('../repositories/rawMaterialRepository');
const AppError = require('../utils/AppError');

class RawMaterialService{
    async createRawMaterial(data){
        const isExisting = await rawRepository.findByReference(data.reference);
        
        if(isExisting) throw new AppError('Une matiere premiere avec cette reference existe deja',400);

        return await rawRepository.create(data);
    };

    async getAllRawMaterials(filters = {}){
        return await rawRepository.findAll(filters);
    };

    async getRawMaterialById(id){
        const isExisting = await rawRepository.findById(id);

        if(!isExisting) throw new AppError('Matiere premiere non trouvée',404);

        return isExisting;
    };

    async updateRawMaterial(id,updateData){
        if(updateData.currentStock) delete updateData.currentStock;
        const updatedMaterial = await rawRepository.update(id,updateData);

        if(!updatedMaterial) throw new AppError('Matière non trouvée',404);

        return updatedMaterial;
    };

    async deleteRawMaterial(id){
        const material = await rawRepository.findById(id);
        if(!material) throw new AppError(`La matiere que vous souhaitez supprimer est introuvable`,404);

        if(material.currentStock > 0) throw new AppError('Impossible de supprimer une matiere avec un stock superieur a zero',400);

        await rawRepository.delete(id);

        return true;
    }
};

module.exports = new RawMaterialService();
const AppError = require('../utils/AppError');
const productRepository = require('../repositories/productRepository');
const rawMaterialRepository = require('../repositories/rawMaterialRepository');
class ProductService {
    async createProduct(data) {
        const prod = await productRepository.findByReference(data.reference);
        if (prod) throw new AppError('Un produit avec cet ref existe deja', 400);

        if(!data.composition || !Array.isArray(data.composition) || data.composition.length === 0) throw new AppError('La composition doit contenir au moins une matiere premiere',400);
    
        for (let i = 0; i < data.composition.length; i++) {
            const mat = await rawMaterialRepository.findById(data.composition[i].materialId);
            if (!mat)
                throw new AppError('Une des matieres premiers de la recette n existe pas', 400);
        }

        const materialIds = data.composition.map(item=>item.materialId.toString());

        if(new Set(materialIds).size !== materialIds.length) throw new AppError('Une matiere ne peut figurer qu une seule fois dans la composition',400);
        return await productRepository.create(data);
    };

    async getAllProducts(filters = {}) {
        return await productRepository.findAll(filters);
    };

    async getProductById(id) {
        const prod = await productRepository.findById(id);

        if (!prod) throw new AppError('Produit introuvable', 404);

        return prod;
    };

    async updateProduct(id, updateData) {
        if (updateData.composition) {
            for (const item of updateData.composition) {
                const mat = await rawMaterialRepository.findById(item.materialId)
                if (!mat)
                    throw new AppError('Un des materiels de la recette n existe pas', 400)
            }
        }

        const updated = await productRepository.update(id, updateData);

        if (!updated) throw new AppError('produit introuvable', 404);

        return updated

    }

    async deleteProduct(id) {
        const prod = await productRepository.findById(id);
        if (!prod) throw new AppError('Produit introuvable', 404);

        return await productRepository.delete(id);
    }
}

module.exports = new ProductService();
const router = require('express').Router();
<<<<<<< HEAD
const {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
     } = require('../controller/productCtrl');
=======
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct } = require('../controller/productCtrl');
>>>>>>> 0daee0d (fist commit of backend ecommerce application website)
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

router.post('/',authMiddleware ,isAdmin,createProduct);
router.get('/:id', getaProduct);
router.put('/:id',authMiddleware ,isAdmin,updateProduct);
router.delete('/:id',authMiddleware, isAdmin,deleteProduct);
router.get('/', getAllProduct);

module.exports = router;
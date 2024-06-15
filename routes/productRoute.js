const router = require('express').Router();

const {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addTowishilist,
    rating,
    uploadImages
     } = require('../controller/productCtrl');


const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImageResize } = require('../middlewares/uploadImages');

router.post('/',authMiddleware ,isAdmin,createProduct);

router.put('/upload/:id',
authMiddleware, 
isAdmin,
uploadPhoto.array('images', 10),
productImageResize,
uploadImages
);

router.put('/rating', authMiddleware, rating);
router.get('/:id', getaProduct);
router.put('/wishlist', authMiddleware,addTowishilist);


router.put('/:id',authMiddleware ,isAdmin,updateProduct);
router.delete('/:id',authMiddleware, isAdmin,deleteProduct);
router.get('/', getAllProduct);

module.exports = router;
const router = require('express').Router();
const {
    createBlog, 
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImages,
    } = require('../controller/blogCtrl');

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { blogImageResize, uploadPhoto } = require('../middlewares/uploadImages');

router.post('/',authMiddleware, isAdmin, createBlog);
router.put('/upload/:id',
authMiddleware, 
isAdmin,
uploadPhoto.array('images', 2),
blogImageResize,
uploadImages
);
router.put('/likes',authMiddleware, likeBlog);
router.put('/dislikes',authMiddleware, dislikeBlog);
router.put('/:id',authMiddleware, isAdmin, updateBlog);

router.get('/:id', getBlog);
router.get('/', getAllBlogs);

router.delete('/:id',authMiddleware, isAdmin, deleteBlog);

module.exports = router;
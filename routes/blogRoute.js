const router = require('express').Router();
const {
    createBlog, 
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    } = require('../controller/blogCtrl');

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.put('/likes',authMiddleware, likeBlog);
router.put('/dislikes',authMiddleware, dislikeBlog);

router.post('/',authMiddleware, isAdmin, createBlog);
router.put('/:id',authMiddleware, isAdmin, updateBlog);

router.get('/:id', getBlog);
router.get('/', getAllBlogs);

router.delete('/:id',authMiddleware, isAdmin, deleteBlog);

module.exports = router;
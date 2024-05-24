const router = require('express').Router();
const {
    createUser,
    loginUserCtrl,
    getAllUser,
    getaUser, 
    deleteaUser,
    updatedaUser, 
    blockUser,
    unblockUser,
    handleRefreshToken,
    logOut
    } = require('../controller/userCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');



router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/all-users',getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logOut);
router.get('/:id', authMiddleware,isAdmin, getaUser);
router.delete('/:id',deleteaUser);
router.put('/edit-user',authMiddleware, updatedaUser);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin, unblockUser);

module.exports = router
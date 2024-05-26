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
    logOut,
    updatePassword,
    forgetPasswordToken,
    resetPassword
    } = require('../controller/userCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');


// post
router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/forgot-password-token', forgetPasswordToken);
router.put('/reset-password/:token', resetPassword);
// get
router.get('/all-users',getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logOut);
router.get('/:id', authMiddleware,isAdmin, getaUser);
// delete
router.delete('/:id',deleteaUser);

// update
router.put('/edit-user',authMiddleware, updatedaUser);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin, unblockUser);
router.put('/password',authMiddleware, updatePassword);

module.exports = router
const router = require('express').Router();
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controller/couponCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');



router.post('/',authMiddleware , isAdmin, createCoupon);
router.get('/',authMiddleware , isAdmin, getAllCoupon);
router.put('/:id',authMiddleware , isAdmin, updateCoupon);
router.delete('/:id',authMiddleware , isAdmin, deleteCoupon);

module.exports = router
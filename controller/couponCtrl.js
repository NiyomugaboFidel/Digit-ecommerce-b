const Coupon = require('../models/couponModel');
const { validateMongoDbId } = require('../utils/validateMongodbid');
const asyncHandler = require('express-async-handler');
// create Coupon
const createCoupon = asyncHandler(async(req, res)=>{
    try {

        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);

    } catch (error) {
        throw new Error(error);
    }
});
// get coupon 
const getAllCoupon = asyncHandler(async(req, res)=>{
    try {

        const coupons = await Coupon.find();
        res.json(coupons);

    } catch (error) {
        throw new Error(error);
    }
});
//update coupon
const updateCoupon = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {

        const updatedcoupons = await Coupon.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedcoupons);

    } catch (error) {
        throw new Error(error);
    }
});

//delete coupon
const deleteCoupon = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {

        const deletedcoupon = await Coupon.findByIdAndDelete(id,req.body,{new:true});
        res.json(deletedcoupon);

    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {createCoupon, getAllCoupon,updateCoupon,deleteCoupon};
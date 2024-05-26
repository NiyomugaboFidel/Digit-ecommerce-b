const Category = require('../models/blogcategoryModel ');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbid');

// create category
const createCategory = asyncHandler(async(req, res)=>{
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);

    } catch (error) {
        throw new Error(error);
    };
});

// update category
const updateCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
     try {
        const updatedCategory = await Category.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedCategory);

    } catch (error) {
        throw new Error(error);
    };
});
// delete a prodcategory
const deleteCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
     try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        
        res.json(deleteCategory);
    } catch (error) {
        throw new Error(error);
    };
});
// get a prodcategory
const getCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
     try {
        const getCategory = await Category.findById(id);
        
        res.json(getCategory);
    } catch (error) {
        throw new Error(error);
    };
});
// get a prodcategory
const getAllCategory = asyncHandler(async(req, res)=>{

     try {
        const getAllCategory = await Category.find();
        
        res.json(getAllCategory);
    } catch (error) {
        throw new Error(error);
    };
});

module.exports = {
    createCategory,
    updateCategory,
     deleteCategory,
     getCategory,
     getAllCategory,
    };
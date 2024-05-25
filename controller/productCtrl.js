const Product  = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
<<<<<<< HEAD
const { validateMongoDbId } = require('../utils/validateMongodbid');
=======
>>>>>>> 0daee0d (fist commit of backend ecommerce application website)

// create a product
const createProduct = asyncHandler(async(req, res)=>{
  try {
    if(req.body.title){
        req.body.slug   = slugify(req.body.title)
    };
    const newProduct = await Product.create(req.body);
    res.json({newProduct});
  } catch (error) {
    throw new Error(error);
  }
});
// update product

const updateProduct = asyncHandler(async(req, res)=>{
    const id = req.params;
<<<<<<< HEAD
    validateMongoDbId(id);
=======
>>>>>>> 0daee0d (fist commit of backend ecommerce application website)
    console.log(id)
    try {
        if(req.body.title){
            req.body.slug   = slugify(req.body.title)
        };
        const updatedProduct = await Product.findByIdAndUpdate(id.id, req.body ,{
                new:true
            });
        res.json(updatedProduct);
    } catch (error) {
        throw new Error(error);
    } 
});

// delete a product
const deleteProduct = asyncHandler(async(req, res)=>{
    const id = req.params;
<<<<<<< HEAD
    validateMongoDbId(id);
=======
>>>>>>> 0daee0d (fist commit of backend ecommerce application website)
    try {
      
        const deletedProduct = await Product.findByIdAndDelete(id.id);
        res.json(deletedProduct);
    } catch (error) {
        throw new Error(error);
    } 
});

// get a product
const getaProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params;
<<<<<<< HEAD
    validateMongoDbId(id);
=======
>>>>>>> 0daee0d (fist commit of backend ecommerce application website)
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
})

const getAllProduct = asyncHandler(async(req, res)=>{

    try {
        // filtering product
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      
        let query=  Product.find(JSON.parse(queryStr));
        // Sorting product

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);

        }else{
            query = query.sort('-createdAt');

        }
         // limiting the fields
         if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
          query = query.select('-__v');
         }


         // pagenation 

         const page = parseInt(req.query.page) || 1;
         const limit = parseInt(req.query.limit) || 10;
         const skip = (page - 1) * limit;
         query = query.skip(skip).limit(limit);
         if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error('This Page does not exists');
         };

        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = {
    createProduct,
    getAllProduct, 
    getaProduct,
    updateProduct,
    deleteProduct,
};
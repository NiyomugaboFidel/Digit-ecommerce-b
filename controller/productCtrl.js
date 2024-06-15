const Product  = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const User = require('../models/userModel');
const fs = require('fs');
const cloudinaryUploadImg = require('../utils/cloudinary');
const { validateMongoDbId } = require('../utils/validateMongodbid');


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

    validateMongoDbId(id);

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

    validateMongoDbId(id);

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
 validateMongoDbId(id);
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
});
const addTowishilist = asyncHandler(async(req, res)=>{
     const {_id}= req.user; 
     const {prodId} = req.body;
     try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString()=== prodId);
        if(alreadyadded){
            let user = await User.findByIdAndUpdate(_id,{
                $pull:{wishlist: prodId},
            },
            {
                new:true
            }
        );
        res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(_id,{
                $push:{wishlist: prodId},
            },
            {
                new:true
            }
        );
        res.json(user);  
        }
     } catch (error) {
        throw new Error(error);
     }

});

const rating = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {star, prodId, comment} = req.body;  
    
    try {
        const product = await Product.findById(prodId);
        const alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        console.log(alreadyRated)
        
        if(alreadyRated){
            const updateRating = await Product.updateOne(
              {
                ratings:{$elemMatch: alreadyRated},
              },
              {
                $set:{ "ratings.$.star": star,"ratings.$.comment": comment}
              },
              {
                new:true
              }
            );
        
        }else{
           const rateProduct = await Product.findByIdAndUpdate(prodId,
            {
                $push:{
                    ratings: {
                        star:star,
                        comment:comment,
                        postedby: _id
                    },
                },
            },
            {
                new:true
            }
           );
           
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;

        let ratingSum = getallratings.ratings.map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
        console.log(totalRating, ratingSum);

        let actualRating = Math.round(ratingSum / totalRating);

        let finalproduct = await Product.findByIdAndUpdate(prodId,{
            totalratings: actualRating
        },{
            new:true
        });
        res.json(finalproduct)

    } catch (error) {
        throw new Error(error);
        
    }       
});

// upload image of product
const uploadImages = asyncHandler(async(req, res)=>{
 const {id} = req.params;
 validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, 'images')
    const urls =[];
    const files = req.files;
    for(const file of files){
        const {path} = file;
        const newpath = await uploader(path);
        console.log({newpath})
        urls.push(newpath);
        fs.unlinkSync(path);
        
    }

    const findproduct = await Product.findByIdAndUpdate(id,{
        images:urls.map((file)=> {
            return file;
        }),
    },{
        new:true,
    });
    res.json(findproduct);
} catch (error) {
    throw new Error(error);
  }
});

module.exports = {
    createProduct,
    getAllProduct, 
    getaProduct,
    updateProduct,
    deleteProduct,
    addTowishilist,
    rating,
    uploadImages,
};
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler =require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbid');
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require('fs');


// create blog
const createBlog = asyncHandler(async(req, res)=>{

    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
        
    };
});
// update a blog
const updateBlog = asyncHandler(async(req, res)=>{
   const {id} = req.params;
   validateMongoDbId(id);
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body,{
            new:true,
        });
        res.json(updatedBlog);
    } catch (error) {
        throw new Error(error);
        
    };
});
// get a blog
const getBlog = asyncHandler(async(req, res)=>{
   const {id} = req.params;
   validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes');
       const updateViews =  await Blog.findByIdAndUpdate(
      id,
        {
            $inc:{numViews:1},
        },
        {
            new:true
        }
    );
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
        
    };
});
// get all blog
const getAllBlogs = asyncHandler(async(req, res)=>{
    try {
        const getAllBlogs = await Blog.find();
       res.json(getAllBlogs);
    } catch (error) {
        throw new Error(error);
        
    };
});

// delete a blog
const deleteBlog = asyncHandler(async(req, res)=>{
    const {id} = req.params;

     try {
         const deleteBlog = await Blog.findByIdAndDelete(id);
         res.json(deleteBlog);
     } catch (error) {
         throw new Error(error);
         
     };
 });
// like a blog
const likeBlog = asyncHandler(async(req, res)=>{
   const {blogId} = req.body;
   validateMongoDbId(blogId);
  
        // Find the blog which you want to be liked
       let blog = await Blog.findById(blogId);
       //find the login user
       const loginUserId = req?.user?._id;
    
       //Find if the user has liked the blog
    //    const isLiked = blog?.isLiked;
       // Find if the user has disliked the blog

       const isDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())

       const isLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())
         if(isDisliked){
         const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull:{ dislikes: loginUserId },
            isDisliked:false,
         },
         {
            new:true,
         }
        );
        await blog.save();
        req.json(blog);

        }

         if(isLiked){
            const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
            $pull: { likes: loginUserId },
            isLiked: false,
             },
             {
                new:true,
             }
            ); 
            await blog.save();
            res.json(blog);
         }else{
            
            const blog = await Blog.findByIdAndUpdate(
                blogId,
                 {
                $push:{ likes: loginUserId },
                isLiked:true,
                isDisliked: false,
             },
             { new:true}
            ); 
             await blog.save();
             res.json(blog);
         }
 });

// dislike a blog
const dislikeBlog = asyncHandler(async(req, res)=>{
   const {blogId} = req.body;
   validateMongoDbId(blogId);
  
        // Find the blog which you want to be liked
       let blog = await Blog.findById(blogId);
       //find the login user
       const loginUserId = req?.user?._id;
    
       //Find if the user has liked the blog

       // const isDisLiked = blog?.isDisliked;
         const isDisLiked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())

       // Find if the user has disliked the blog
       const isLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())

    
         if(isLiked){
         const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull:{ likes: loginUserId },
            isLiked:false,
         },
         {
            new:true,
         }
        );
        await blog.save()
        res.json(blog);

        }

         if(isDisLiked){
            const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
             },
             {
                new:true,
             }
            ); 
            await blog.save()
            res.json(blog);
         }else{
            
            const blog = await Blog.findByIdAndUpdate(
                blogId,
                 {
                $push:{ dislikes: loginUserId },
                isDisliked:true,
                isLiked: false,
             },
             { new:true}
            ); 
             await blog.save();
             res.json(blog);
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
           console.log(path)
           const newpath = await uploader(path);
           console.log({newpath})
           urls.push(newpath);
         fs.unlinkSync(path);

       }
   
       const findblog = await Blog.findByIdAndUpdate(id,{
           images:urls.map((file)=> {
               return file;
           }),
       },{
           new:true,
       });
       res.json(findblog);
   } catch (error) {
       throw new Error(error);
     }
   });

module.exports = {
    createBlog,
    updateBlog,
    getAllBlogs,
    getBlog,
    deleteBlog, 
    likeBlog,
    dislikeBlog,
    uploadImages
};


const asyncHandler = require('express-async-handler');
const Categories = require('../models/categoryModel')
const cloudinary = require('cloudinary').v2;

//@desc use to get all categories
//@route GET /api/categories/
//@not protected
//@access all users
const  getCategories = asyncHandler( async (req, res) =>{
    const categories = await Categories.find().select('-createdAt').select('-updatedAt').select('-__v')
    if(categories){
        res.status(200).json(categories)
    }else{
        res.status(400)
        throw new Error('unable to fetch categories')
    }

})


//@desc use to get category
//@route GET /api/catgeories/:id
//@protected
//@access SuperAdmin
const  getCategory = asyncHandler( async (req, res) =>{
    const category = await Categories.findById(req.params.id)
    if(category){
        res.status(200).json(category)
        
    }else{
        res.status(400)
        throw new Error('unable to fetch this category')
    }


})

//@desc use to add category
//@route POST /api/categories/
//@protected
//@access superAdmin
const  addCategory = asyncHandler( async (req, res) =>{
    //check if empty value was sent
    const { title, description }  = req.body


    if(!title || !description){
        res.status(400)
        throw new Error('please fill the required field')
    }

    
    //check if category already exist
    const catExist = await Categories.findOne({title})
    if(catExist){
        res.status(400)
        throw new Error('this category already exist')
    }

    const icon = req.file

    //upload categ
    const uploadImage = await cloudinary.uploader.upload(icon.path, {public_id: `${icon.filename}`}, (error, result) => {
        if (!error) {
          //do something
        } else {
            res.status(400)
            throw new Error('unable to upload images')
        }}
        )



    // Generate 
    const url = cloudinary.url(`${icon.filename}`, {
        width: 200,
        height: 200,
        Crop: 'fill'
    });

    //create category
    const category = await Categories.create({
        title,
        description,
        icon:url
    })

    if(category){
        res.status(200).json({message:'category has been created successfully'})
    }else{
        res.status(400)
        throw new Error('unable to create this category')
    }


})




//@desc use to edit category
//@route PUT /api/categories/:id
//@protected
//@access SuperAdmin
const  editCategory = asyncHandler( async (req, res) =>{
    
    

     //get all new details
    const { title, description }  = req.body
    const icon = req.file

    //check if category exist
    const catExist = await Categories.findById(req.params.id)
    if(!catExist){
        res.status(400)
        throw new Error('this category does not exist, you should create a new category instead')
    }

    //get old details
    let newImgUrl = ''
    let newTitle = ''
    let newDes = ''
    
    if(!icon){
        newImgUrl = catExist.icon
    }else{

        //update image by delecting old image and uploading a new one
        let oldImagePid = catExist.icon.split('/')[7]

        const deletOldImage = await cloudinary.uploader.destroy(oldImagePid, (error, result) => {
            if (!error) {
            //do something
            } else {
                res.status(400)
                throw new Error('unable to delete old images')
            }}
            )


            const uploadNewImage = await cloudinary.uploader.upload(icon.path,{public_id: `${icon.filename}`}, (error, result) => {
                if (!error) {
                //do something
                } else {
                    res.status(400)
                    throw new Error('unable to upload new images')
                }}
                )

                // Generate 
                newImgUrl = cloudinary.url(`${icon.filename}`, {
                    width: 200,
                    height: 200,
                    Crop: 'fill'
                });


    }

    if(!title){
        newTitle = catExist.title
    }else{
        newTitle = title
    }

    if(!description){
        newDes = catExist.description
    }else{
        newDes = description
    }


    const category = await Categories.findByIdAndUpdate(req.params.id, {title:newTitle, icon:newImgUrl, description:newDes}, {$CurrentDate:{lastUpdate:true}})
    if(category){
        res.status(200).json({message:'category has been updated'})
    }else{
        res.status(404)
        throw new Error('unable to update category')
    }

})

module.exports = {
    addCategory,
    getCategories,
    getCategory,
    editCategory
}
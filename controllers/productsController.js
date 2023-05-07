const asyncHandler = require('express-async-handler')
const Products = require('../models/productsModel')
const cloudinary = require('cloudinary').v2;


//@desc use to get all products
//@route GET /api/products/:limit?/:skip?
//@not protected
//@access all users
const getProducts = asyncHandler( async (req, res)=>{

    let limit = 25;
    let skip = 0;

    if(req.params.limit !== "undefined"){
        limit = req.params.limit
    }

    if(req.params.skip !== "undefined"){
        skip = req.params.skip
    }

    const count = await Products.countDocuments();
    const products = await Products.find().limit(limit).skip(skip)

    if(products){
        res.status(200).json({data:products, total:count})
    }else{
        res.status(400)
        throw new Error('unable to get products')
    }

})

//@desc use to get one product
//@route GET /api/products/:id
//@not protected
//@access all users
const getProduct = asyncHandler( async (req, res)=>{

    const product = await Products.findById(req.params.id)
    if(product){
        res.status(200).json(product)
    }else{
        res.status(400)
        throw new Error('unable to get product')
    }

})

//@desc use to get all products by category
//@route GET /api/products/category/:catid
//@not protected
//@access all users
const getProductsByCategory = asyncHandler( async (req, res)=>{

    let limit = 25;
    let skip = 0;

    if(req.params.limit !== "undefined"){
        limit = req.params.limit
    }

    if(req.params.skip !== "undefined"){
        skip = req.params.skip
    }

    const count = await Products.countDocuments({category:req.params.catid});
    const products = await Products.find({category:req.params.catid}).limit(limit).skip(skip)

    if(products){
        res.status(200).json({data:products, total:count})
    }else{
        res.status(400)
        throw new Error('unable to get products in this category')
    }

})


//@desc use to get all products
//@route GET /api/products/search/:limit?/:skip?
//@not protected
//@access all users
const getProductsBySearch = asyncHandler( async (req, res)=>{

    let { search } = req.params


    if(!search){
        search = ''
    }

    let limit = 25;
    let skip = 0;

    if(req.params.limit !== "undefined"){
        limit = req.params.limit
    }

    if(req.params.skip !== "undefined"){
        skip = req.params.skip
    }

    
    const count = await Products.countDocuments({$or:[{title:{$regex:search, $options:'i'}}, {description:{$regex:search, $options:'i'}}]});
    const products = await Products.find({$or:[{title:{$regex:search, $options:'i'}}, {description:{$regex:search, $options:'i'}}]}).limit(limit).skip(skip)

    if(products){
        res.status(200).json({data:products, total:count})
    }else{
        res.status(400)
        throw new Error('no results found')
    }

})


//@desc use to add products
//@route POST /api/products/
//@protected
//@access SuperAdmin and some admin
const addProduct = asyncHandler( async (req, res)=>{

    

    const { title, description, price, discountPercentage, rating, stock, brand, category } = req.body







    if(!title || !description || !rating || !price || !stock || !brand || !category || !discountPercentage ){
        res.status(400)
        throw new Error('please fill the required field')
    }

    const images = req.files
    const urlArr = []

    if(images.length < 4){
        res.status(400)
        throw new Error('a minimum of four image is required')
    }
    
    await  images.map( image => {
        const uploadNewImage = cloudinary.uploader.upload(image.path,{public_id: `${image.filename}`, overwrite: true }, (error, result) => {
            if (!error) {
            } else {
                res.status(400)
                throw new Error('unable to upload new images')
            }}
            )

            const ImgUrl = cloudinary.url(`${image.filename}`, {
                width: 300,
                height: 250,
                Crop: 'fill'
            });


           return urlArr.push(ImgUrl)
    });



    const product = await Products.create({
        title,
        description,
        price,
        discountPercentage,
        rating,
        stock,
        brand,
        category,
        images:urlArr
    })

    if(product){
        res.status(200).json({message:'product added successfully'})
    }else{
        res.status(400)
        throw new Error('unable to create new product')
    }

})


//@desc use to edit product
//@route PUT /api/products/:id
//@protected
//@access SuperAdmin and some admin
const editProducts = asyncHandler( async (req, res)=>{


    
    

    const { title, description, price, discountPercentage, rating, stock, brand, category } = req.body
    const thumbnail = req.files.thumbnail
    const image1 = req.files.image1
    const image2 = req.files.image2
    const image3 = req.files.image3
    const imgUrl = []

    // console.log(req.files)

    let newTitle
    let newDes
    let newPrice
    let newDic
    let newRating
    let newStock
    let newBrand
    let newCat
    let newThumbUrl
    let img1Url
    let img2Url
    let img3Url

    //check if product exist
    const productExist = await Products.findById(req.params.id)
    if(!productExist){
        res.status(400)
        throw new Error('this product does not exist, you should create a new product instead')
    }

    if(!title){
        newTitle = productExist.title
    }else{
        newTitle = title
    }

    if(!description){
        newDes = productExist.description
    }else{
        newDes = description
    }

    if(!price){
        newPrice = productExist.price
    }else{
        newPrice = price
    }

    if(!discountPercentage){
        newDic = productExist.discountPercentage
    }else{
        newDic = discountPercentage
    }

    if(!rating){
        newRating = productExist.rating
    }else{
        newRating = rating
    }

    if(!stock){
        newStock = productExist.stock
    }else{
        newStock = stock
    }

    if(!brand){
        newBrand = productExist.brand
    }else{
        newBrand = brand
    }

    if(!category){
        newCat = productExist.category
    }else{
        newCat = category
    }

    console.log(thumbnail)

    if(!thumbnail){
        newThumbUrl = productExist.images[0]
        imgUrl.push(newThumbUrl)
    }else{

        //update image by delecting old image and uploading a new one
        let oldImagePid = productExist.images[0].split('/')[7]

        const deletOldImage = await cloudinary.uploader.destroy(oldImagePid, (error, result) => {
            if (!error) {
            //do something

            } else {
                res.status(400)
                throw new Error('unable to delete old images')
            }}
            )

           
            const uploadNewImage = await cloudinary.uploader.upload(thumbnail[0].path,{public_id: `${thumbnail[0].filename}`}, (error, result) => {
                if (!error) {
                //do something
    

                } else {
              

                    res.status(400)
                    throw new Error('unable to upload new images')
                }}
                )

                // Generate 
                newThumbUrl = cloudinary.url(`${thumbnail[0].filename}`, {
                    width: 300,
                    height: 250,
                    Crop: 'fill'
                });

                imgUrl.push(newThumbUrl)

        }





        if(!image1){
            img1Url = productExist.images[1]
            imgUrl.push(img1Url)
        }else{
    
            //update image by delecting old image and uploading a new one
            let oldImagePid = productExist.images[1].split('/')[7]
    
            const deletOldImage = await cloudinary.uploader.destroy(oldImagePid, (error, result) => {
                if (!error) {
                //do something
                } else {
                    res.status(400)
                    throw new Error('unable to delete old images')
                }}
                )
    
                
                const uploadNewImage = await cloudinary.uploader.upload(image1[0].path,{public_id: `${image1[0].filename}`}, (error, result) => {
                    if (!error) {
                    //do something
                    } else {
                        console.log(error)
                    }}
                    )
    
                    // Generate 
                    img1Url = cloudinary.url(`${image1[0].filename}`, {
                        width: 300,
                        height: 250,
                        Crop: 'fill'
                    });
    
                    imgUrl.push(img1Url)
            }





            if(!image2){
                img2Url = productExist.images[2]
                imgUrl.push(img2Url)
            }else{
        
                //update image by delecting old image and uploading a new one
                let oldImagePid = productExist.images[2].split('/')[7]
        
                const deletOldImage = await cloudinary.uploader.destroy(oldImagePid, (error, result) => {
                    if (!error) {
                    //do something
                    } else {
                        res.status(400)
                        throw new Error('unable to delete old images')
                    }}
                    )
        
        
                    const uploadNewImage = await cloudinary.uploader.upload(image2[0].path,{public_id: `${image2[0].filename}`}, (error, result) => {
                        if (!error) {
                        //do something
                        } else {
                            res.status(400)
                            throw new Error('unable to upload new images')
                        }}
                        )
        
                        // Generate 
                        img2Url = cloudinary.url(`${image2[0].filename}`, {
                            width: 300,
                            height: 250,
                            Crop: 'fill'
                        });
        
                        imgUrl.push(img2Url)
                }



                if(!image3){
                    img3Url = productExist.images[3]
                    imgUrl.push(img3Url)
                }else{
            
                    //update image by delecting old image and uploading a new one
                    let oldImagePid = productExist.images[3].split('/')[7]
            
                    const deletOldImage = await cloudinary.uploader.destroy(oldImagePid, (error, result) => {
                        if (!error) {
                        //do something
                        } else {
                            res.status(400)
                            throw new Error('unable to delete old images')
                        }}
                        )
            
            
                        const uploadNewImage = await cloudinary.uploader.upload(image3[0].path,{public_id: `${image3[0].filename}`}, (error, result) => {
                            if (!error) {
                            //do something
                            } else {
                                res.status(400)
                                throw new Error('unable to upload new images')
                            }}
                            )
            
                            // Generate 
                            img3Url = cloudinary.url(`${image3[0].filename}`, {
                                width: 300,
                                height: 250,
                                Crop: 'fill'
                            });
            
                            imgUrl.push(img3Url)
                    }


    


    




    const product = await Products.findByIdAndUpdate(req.params.id, {
        title:newTitle,
        description:newDes,
        price:newPrice,
        discountPercentage:newDic,
        rating:newRating,
        stock:newStock,
        brand:newBrand,
        category:newCat,
        images:imgUrl
    }, {$currentDate:{lastUpdate:true}})


    if(product){
        res.status(200).json({message:'product has been updated successfully'})
    }else{
        res.status(400)
        throw new Error('unable to create new product')
    }
})






//@desc use to delete product
//@route DELETE /api/products/:id
//@protected
//@access SuperAdmin and some admin
const deleteProducts = asyncHandler( async (req, res)=>{

    const GetImage = await Products.findById(req.params.id)
    const images = GetImage.images
    await images.forEach(element => {

        let ImagePid = element.split('/')[7]
         deleteImage =  cloudinary.uploader.destroy(ImagePid, (error, result) => {
            if (!error) {
            //do something
            } else {
                res.status(400)
                throw new Error('unable to delete old images')
            }}
            )
        
    });


    const deleteProduct = await Products.findByIdAndDelete(req.params.id) 

    if(deleteProduct){
        res.status(200).json({message:'product deleted successfully'})
    }else{
        res.status(400)
        throw new Error('unable to delete this product')
    }


})


module.exports = {
    getProduct,
    getProducts,
    getProductsByCategory,
    getProductsBySearch,
    addProduct,
    editProducts,
    deleteProducts
}

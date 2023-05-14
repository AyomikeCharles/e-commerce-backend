const Products = require('../models/productsModel')
const Wishlist = require('../models/wishlistModel')
const asyncHandler = require('express-async-handler');




const getWishlist = asyncHandler(async(req, res)=>{

    
    const isProduct = await Wishlist.findOne({user:req.params.userid})


    if(isProduct){
        res.status(200).json(isProduct)
    }else{
        res.status(400)
        throw new Error('you dont have any product in wishlist')
    }

})



const addWishlist = asyncHandler( async(req, res)=>{
    const { user, product } = req.body

    if(!user || !product){
        res.status(400)
        throw new Error('bad request')
    }

    
    const isProduct = await Wishlist.findOne({user})

    if(isProduct){
        const allProduct = isProduct.product
        const theProduct = allProduct.find(prod=>prod._id === product._id)

        if(theProduct){
            res.status(200).json({message:'this product already exist in your wishlist'})
        }else{

            allProduct.push(product)
        

            const add = await Wishlist.findByIdAndUpdate(isProduct._id, {product:allProduct}, {$currentDate:{lastUpdate:true}})
            if(add){
                res.status(200).json({message:'product has been added to wishlist'})
            }else{
                res.status(400)
                throw new Error('unable to add product to wishlist')
            }
        }
    }else{
        const wishlist = await Wishlist.create({
            user,
            product
        })

        if(wishlist){
            res.status(200).json({message:'product has been added to wishlist'})
        }else{
            res.status(400)
            throw new Error('unable to add product to wishlist')
        }

    }

})




const removeItem = asyncHandler( async(req, res)=>{
    const { productid } = req.body

    if(!productid){
        res.status(400)
        throw new Error('bad request')
    }

    
    const isProduct = await Wishlist.findById(req.params.id)
    if(isProduct){
        const allProduct = isProduct.product
        const theProduct = allProduct.filter(prod=>prod._id !== productid)

        const update = await Wishlist.findByIdAndUpdate(req.params.id, {product:theProduct}, {$currentDate:{lastUpdate:true}})
        if(update){
            res.status(200).json({message:'product has been remove from wishlist'})
        }else{
            res.status(400)
            throw new Error('unable to remove product from wishlist, try again') 
        }
    }else{
        res.status(400)
        throw new Error('this wishlist does not exist') 
    }

})

module.exports = {
    addWishlist,
    removeItem,
    getWishlist
}
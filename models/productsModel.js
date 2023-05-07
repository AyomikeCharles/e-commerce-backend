const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    title:{
        type:String,
        required:[true, 'title of product is required']
    },
    description:{
        type:String,
        required:[true, 'description of product is required']
    },
    price:{
        type:Number,
        required:[true, 'price of product is required']
    },
    discountPercentage:{
        type:Number,
    },
    rating:{
        type:Number,
    },
    stock:{
        type:Number,
        required:[true, 'stock of product is required']
    },
    brand:{
        type:String,
        required:[true, 'brand of product is required']
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, 'category of product is required'],
        ref:'Categories',
    },
    images:{
        type:[],
        required:[true, 'images of product is required']
    }
},{
    timestamps:true
})



module.exports = mongoose.model('Products', ProductSchema)
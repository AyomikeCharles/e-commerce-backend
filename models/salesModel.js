const mongoose = require('mongoose')

const salesSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    shipping:{
        type:[],
        required:[true, 'shipping location is required']
    },
    personalDetails:{
        type:[],
        required:[true, 'personal details is required']
    },
    products:{
        type:[],
        required:[true, 'products is required']
    },
    paymentStatus:{
        type:String,
        default:'unpaid'
    },
    transactionStatus:{
        type:String,
        default:'processing'
    },
    moreDetails:{
        type:String,
    },
    subtotal:{
        type:String,
        required:[true, 'subtotal is required']
    },
    shippingPrice:{
        type:String,
        required:[true, 'shipping price is required'] 
    }

},{
    timestamps:true
})

module.exports = mongoose.model('Sales', salesSchema)
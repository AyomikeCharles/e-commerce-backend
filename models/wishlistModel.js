const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:[true, 'user is required']
    },
    product:{
        type:[],
        required:[true, 'product is required']
    }

},{
    timestamps:true
})

module.exports = mongoose.model('Wishlist', wishlistSchema)
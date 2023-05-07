const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    title:{
        type:String,
        required:[true, 'title of category is required'],
        unique:true
    },
    icon:{
        type:String,
        required:[true, 'icon of category is required']
    },
    description:{
        type:String,
        required:[true, 'description of category is required']
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Categories', CategorySchema)
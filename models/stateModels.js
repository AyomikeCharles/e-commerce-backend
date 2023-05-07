const mongoose = require('mongoose')

const statesSchema = mongoose.Schema({
    
    state:{
        type:String,
        required:[true, 'state is required']
    },
    price:{
        type:String,
        required:[true, 'price details is required']
    },
    region:{
        type:String,
        required:[true, 'region is required']
    },

},{
    timestamps:true
})

module.exports = mongoose.model('States', statesSchema)
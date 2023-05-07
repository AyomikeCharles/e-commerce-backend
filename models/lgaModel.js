const mongoose = require('mongoose')

const lgasSchema = mongoose.Schema({
    
    lgas:{
        type:String,
        required:[true, 'lga is required']
    },
    state:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'States',
        required:[true, 'state is required']
    },

},{
    timestamps:true
})

module.exports = mongoose.model('Lgas', lgasSchema)
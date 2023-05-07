const mongoose = require('mongoose')

const RolesSchema = mongoose.Schema({
    value:{
        type:String,
        required:[true, 'value is requires']
    },
    path:{
        type:String,
        required:[true, 'path is requires']
    },
  
},{
    timestamps:true
})

module.exports = mongoose.model('Roles', RolesSchema )
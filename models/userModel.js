const mongoose = require('mongoose')

const UsersSchema = mongoose.Schema({
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Roles",
        required:[true, 'role is required']
    },
    fullName:{
        type:String,
        required:[true, 'name is required']
    },
    email:{
        type:String,
        required:[true, 'email is required'],
        unique:true
    },
    phoneNumber:{
        type:String,
        required:[true, 'phone number is required']
    },
    password:{
        type:String,
        required:[true, 'password is required']
    },
    whatsapp:{
        type:String,
    },
    status:{
        type:String,
        default:'unblock',
        required:[true, 'status is required']
    },
    state:{
        type:String,
        default:'unverified',
        required:[true, 'state is required']
    },
    refreshToken:{
        type:String
    },
    shipping:{
        type:[],
    },
    tandc:{
        type:Boolean,
        required:[true, 'terms and condition is required']
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Users', UsersSchema)
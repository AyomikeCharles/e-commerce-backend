const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const Users = require('../models/userModel')
const Roles = require('../models/roleModel')


const authorized = asyncHandler (async (req, res, next) => {
    let accessToken
    

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            try{
            accessToken = req.headers.authorization.split(' ')[1]

            const decode = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN)
            //get user and role
            req.user = await Users.findById(decode.id).select('-password').select("-refreshToken");
           
            const role = await Roles.findById(decode.role)
            req.role = role.value

            next()
            }catch(err){
                res.status(401)
                throw new Error(err)
            }
        }

        if(!accessToken){
            res.status(400)
            throw new Error('bad request, no access token found')
        }
})

module.exports = {
    authorized
}
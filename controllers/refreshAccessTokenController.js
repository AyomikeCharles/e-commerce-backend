const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const Roles = require('../models/roleModel')


//generate access token
const generateAccessToken = (id, role, link) =>{
    return jwt.sign({id, role, link},process.env.JWT_ACCESS_TOKEN, {
        expiresIn:'3h'//may change time later
    })
}


const generateRefreshToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_REFRESH_TOKEN, {
        expiresIn:'1d'
    })
}


const refreshTokenControl = asyncHandler( async  (req, res) =>{
    const cookies = req.cookies;

    //check cookie for refresh token
    if(!cookies?.jwtRefreshToken){
        res.status(403)
        throw new Error('section expired')
    }
    
    const refreshToken = cookies.jwtRefreshToken;
    
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN)
    
    if(decode.exp * 1000 < Date.now()){
        res.status(403)
        throw new Error('section expired')
    }

    //generate new refresh token
    const newRefreshToken = generateRefreshToken(decode.id)

    

    //get user
    const user = await Users.findByIdAndUpdate(decode.id, {refreshToken:newRefreshToken}, {$currentDate:{lastUpdate:true}})

    if (user){
        const rolePath = await Roles.findById(user.role)
        const path = rolePath.path
        //generate new access token
        const newAccessToken = generateAccessToken(user.id, user.role, path);
        res.cookie('jwtRefreshToken', newRefreshToken, {httpsOnly:true, sameSite:'none', secure:true, maxAge:24 * 60 * 60 * 1000})//change httpOnly to httpsOnly in production, also add secure:true and sameSite:'none' if project is added on different hosting platform
        res.status(200).json(newAccessToken)
    }


})

module.exports = {
    refreshTokenControl
}
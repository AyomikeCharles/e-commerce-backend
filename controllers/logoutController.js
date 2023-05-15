const Users = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const logout = asyncHandler( async (req, res) => {
    //frontend developer should delete access token on client side

    const cookies = req.cookies;

    //check cookie for refresh token
    if(!cookies?.jwtRefreshToken){
        res.status(200).json({message:"cookies not found"})
    }

    const refreshToken = cookies.jwtRefreshToken;
    
    //check DB for refreshtoken
    const OwnerOfToken = await Users.findOne({refreshToken})
    if(!OwnerOfToken){
        //delete refresh token if token has no owner but its available in cookie
        res.clearCookie('jwtRefreshToken', {httpsOnly:true, sameSite:'none', secure:true, maxAge:24 * 60 * 60 * 1000})//change httpOnly to httpsOnly in production, also add secure:true and sameSite:'none' if project is added on different hosting platform
        res.status(200).json({message:"already logged out"})
        }

    


    //delete refresh token from DB
    const deleteRefreshToken = await Users.updateOne(
        {_id:OwnerOfToken.id},
        {$set:{refreshToken:''}}, 
        {$currentDate:{lastUpdate:true}}
        )

    if(deleteRefreshToken){
    res.clearCookie('jwtRefreshToken', {httpsOnly:true, sameSite:'none', secure:true, maxAge:24 * 60 * 60 * 1000})//change httpOnly to httpsOnly in production, also add secure:true and sameSite:'none' if project is added on different hosting platform
    res.status(200).json({message:"hope to see you soon"})
    
    }

})

module.exports = {
    logout
}
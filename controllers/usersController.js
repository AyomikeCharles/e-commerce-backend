const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('../models/userModel')
const Roles = require('../models/roleModel')

const main = require('../nodemailer') 


//access token generator
const generateAccessToken = (id, role, link) =>{
   return jwt.sign({id, role, link}, process.env.JWT_ACCESS_TOKEN, {
        expiresIn:'3h'
    } )
}

//refresh token generator
const generateRefreshToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_REFRESH_TOKEN, {
        expiresIn:'1d'
    })
}





//@desc use to get all user
//@route GET /api/users/admin/:limit?/:skip?
//@protected
//@access all Admins
const  getAlluser = asyncHandler( async (req, res) =>{

    let { search } = req.params

    if(!search){
        search = ''
    }

    let limit = 25;
    let skip = 0;

    if(req.params.limit !== "undefined"){
        limit = req.params.limit
    }

    if(req.params.skip !== "undefined"){
        skip = req.params.skip
    }

    const value = 'y56d3#45c'
    const roles = await Roles.findOne({value});
    const count = await Users.countDocuments({$and:[{role:roles._id}, {$or:[{fullName:{$regex:search, $options:'i'}},{email:{$regex:search, $options:'i'}},{phoneNumber:{$regex:search, $options:'i'}}]}]});
    const allUsers = await Users.find({$and:[{role:roles._id}, {$or:[{fullName:{$regex:search, $options:'i'}},{email:{$regex:search, $options:'i'}},{phoneNumber:{$regex:search, $options:'i'}}]}]}).limit(limit).skip(skip).select("-password").select("-refreshToken").select("-role")
    
    if(allUsers && count){
        res.status(200).json({data:allUsers, totalUsers:count});
    }else{
        res.status(404)
        throw new Error(`unable to fetch users` )
    }

})





//@desc use to search for users
//@route GET /api/users/search/:limit?/:skip?
//@protected
//@access all Admins
const  searchAlluser = asyncHandler( async (req, res) =>{

    const { search } = req.body

    if(!search){
        res.status(400)
        throw new Error('no search value')
    }

    let limit = 25;
    let skip = 0;

    if(req.params.limit !== "undefined"){
        limit = req.params.limit
    }

    if(req.params.skip !== "undefined"){
        skip = req.params.skip
    }

    const value = 'y56d3#45c'
    const roles = await Roles.findOne({value});
    const count = await Users.countDocuments({$and:[{role:roles._id}, {$or:[{fullName:{$regex:search, $options:'i'}},{email:{$regex:search, $options:'i'}},{phoneNumber:{$regex:search, $options:'i'}}]}]});
    const allUsers = await Users.find({$and:[{role:roles._id}, {$or:[{fullName:{$regex:search, $options:'i'}},{email:{$regex:search, $options:'i'}},{phoneNumber:{$regex:search, $options:'i'}}]}]}).limit(limit).skip(skip).select("-password").select("-refreshToken").select("-role")
    if(allUsers && count){
        res.status(200).json({data:allUsers, totalUsers:count});
    }else{
        res.status(404)
        throw new Error(`unable to fetch ${search}` )
    }
    
})






//@desc use to get all admin
//@route GET /api/users/admin/:limit?/:skip?
//@protected
//@access superAdmins
const  getAllAdmin = asyncHandler( async (req, res) =>{

    
    const value = '5ry5@9%96'
    const roles = await Roles.findOne({value});
    const count = await Users.countDocuments({role:roles._id});
    const allUsers = await Users.find({role:roles._id}).select("-password").select("-refreshToken").select("-role")
    res.status(200).json({data:allUsers, totalUsers:count});
    
    
})





//@desc use to search all admin
//@route GET /api/users/admin/search/:limit?/:skip?
//@protected
//@access superAdmins
const  searchAllAdmin = asyncHandler( async (req, res) =>{

    const { search } = req.body

    if(!search){
        res.status(400)
        throw new Error('no search value')
    }

    let limit = 25;
    let skip = 0;

    if(req.params.limit !== "undefined"){
        limit = req.params.limit
    }

    if(req.params.skip !== "undefined"){
        skip = req.params.skip
    }

    const value = '5ry5@9%96'
    const roles = await Roles.findOne({value});
    const count = await Users.countDocuments({$and:[{role:roles._id}, {$or:[{fullName:{$regex:search, $options:'i'}},{email:{$regex:search, $options:'i'}},{phoneNumber:{$regex:search, $options:'i'}}]}]});
    const allAdmin = await Users.find({$and:[{role:roles._id}, {$or:[{fullName:{$regex:search, $options:'i'}},{email:{$regex:search, $options:'i'}},{phoneNumber:{$regex:search, $options:'i'}}]}]}).limit(limit).skip(skip).select("-password").select("-refreshToken").select("-role")
    if(allAdmin && count){
        res.status(200).json({data:allAdmin, totalUsers:count});
    }else{
        res.status(404)
        throw new Error(`unable to fetch ${search}` )
    }
    
    
})



//@desc use to get public profile
//@route GET /api/users/:id
//@protected
//@access all Admins
const  getPublicProfile = asyncHandler( async (req, res) =>{

    const publicProfile = await Users.findById(req.params.id).select("-password").select("-refreshToken")

    if(!publicProfile){
        res.status(400)
        throw new Error('cannot find this user')
    }

    res.status(200).json(publicProfile); 


    
})




//@desc use to get private profile
//@route GET /api/users/personal-profile'/
//@protected
//@access owner of account
const  getPersonalProfile = asyncHandler( async (req, res) =>{

  res.status(200).json(req.user)

    
})







//@desc use to sign up
//@route POST /api/users/
//@not protected
//@access everyone
const  setAllUsers = asyncHandler( async (req, res) =>{


    const { fullName, email, phoneNumber, password, tandc } = req.body

   
    

    //check if optinal field was sent
    let whatsapp = ''
    if(req.body.whatsapp){
        whatsapp = req.body.whatsapp
    }


    //check if all compulsory field were sent
    if(!fullName || !email || !phoneNumber || !password || !tandc){
        res.status(400)
        throw new Error('please fill all the compulsory field')
    }

    //check if user already exist
    const userExist = await Users.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error('this user already exist')
    }

    //hash password

    const salt = await bcrypt.genSalt(5)
    const hashPassword = await bcrypt.hash(password, salt)

    //get roles
    value = 'y56d3#45c'
    const role = await Roles.findOne({value})

    //create user
    const user = await Users.create({
        fullName,
        email,
        phoneNumber,
        whatsapp,
        role:role.id,
        tandc,
        password:hashPassword,
    })

    if(user){

        //send email verification

        const verificationToken = Math.random().toString(36).substring(2);
        const link = `https://brezzy.netlify.app/verify/${verificationToken}`
        const message = `kindly verify your email with this link ${link}`
        const subject = 'Email Verification'

        await main(user.email, message, subject).catch(err=>{
            // console.log(err)
        });

        const firstRefreshToken = generateRefreshToken(user.id)

        await Users.findByIdAndUpdate(user.id,{refreshToken:firstRefreshToken, verificationStatus:verificationToken}, {$currentDate:{lastUpdate:true}})
        const rolePath = await Roles.findById(user.role)
        const path = rolePath.path
        res.cookie('jwtRefreshToken', firstRefreshToken, {httpsOnly:true, sameSite:'none', secure:true, maxAge:24 * 60 * 60 * 1000})//change httpOnly to httpsOnly in production, also add secure:true and sameSite:'none' if project is added on different hosting platform
        res.status(200).json({
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            whatsapp:user.whatsapp,
            status:user.status,
            accessToken:generateAccessToken(user._id, user.role, path)
        })
    }

})




//@desc use to sign in
//@route POST /api/users/login
//@not protected
//@access everyone
const  setUser = asyncHandler( async (req, res) =>{

    const { email, password } = req.body

    if(!email || !password){
        res.status(400)
        throw new Error('please fill all field')
    }

    //check for users
    const user = await Users.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        
        //generate new Refresh token
        const newRefreshToken = generateRefreshToken(user.id);
        const rolePath = await Roles.findById(user.role)
        const path = rolePath.path

        //update refreshToken
        await Users.updateOne(
            {_id:user.id},
            {$set:{refreshToken:newRefreshToken}}, 
            {$currentDate:{lastUpdate:true}}
            )

            //send refresh token in cookie as httponly
        res.cookie('jwtRefreshToken',  newRefreshToken, {httpsOnly:true, sameSite:'none', secure:true, maxAge:24 * 60 * 60 * 1000})//change httpOnly to httpsOnly in production, also add secure:true and sameSite:'none' if project is added on different hosting platform
        //send user details and access token
        res.status(200).json({
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            whatsapp:user.whatsapp,
            status:user.status,
            accessToken:generateAccessToken(user._id, user.role, path)
        })

        
    }else{
        res.status(400)
        throw new Error('invalid credentials')
    }
    
})




//@desc use to edit personal profile
//@route PUT /api/users/
//@protected
//@access owner of account
const  editUser = asyncHandler( async (req, res) =>{

    const { name, phoneNumber, whatsapp, state, lga, address } = req.body

    //get old details

    const current = await Users.findById(req.user._id)

    let newName
    let newPhoneNumber
    let newWhatsapp
    let newShipping

    if(!name){
        newName = current.fullName
    }else{
        newName = name
    }

    if(!phoneNumber){
        newPhoneNumber = current.phoneNumber
    }else{
        newPhoneNumber = phoneNumber
    }

    if(!whatsapp){
        newWhatsapp = current.whatsapp
    }else{
        newWhatsapp = whatsapp
    }

    if(!state && !lga && !address){
        newShipping = current.shipping
    }else{
        newShipping = [state, lga, address]
    }


    const user = await Users.findByIdAndUpdate(req.user.id, {fullName:newName, phoneNumber:newPhoneNumber, whatsapp:newWhatsapp, shipping:newShipping}, {$currentDate:{lastUpdate:true}})
        
    if(user){
        res.status(200).json({
            message:'your account has been updated successfully'
        })
    }else{
        res.status(400)
        throw new Error('unable to edit profile')
    }
    
})




//@desc use to block users or admin
//@route PUT /api/users/block/:id
//@protected
//@access superAdmin and some admin
const  blockUser = asyncHandler( async (req, res) =>{

    const { statusValue } = req.body

    if(!statusValue){
        res.status(400)
        throw new Error('no status value sent to update user status with')
    }

    const block = await Users.findByIdAndUpdate(req.params.id, {$set:{status:statusValue}}, {$currentDate:{lastUpdate:true}})
    
    if(block){
        res.status(200).json({message:statusValue})
    }else{
        res.status(400)
        throw new Error('unable to block user')
    }


})




//@desc use to block users or admin
//@route PUT /api/users/block/:id
//@protected
//@access superAdmin and some admin
const  changeRole = asyncHandler( async (req, res) =>{

    const { roleValue } = req.body

    if(!roleValue){
        res.status(400)
        throw new Error('no admin value sent to update user role with')
    }

    const role = await Users.findByIdAndUpdate(req.params.id, {$set:{role:roleValue}}, {$currentDate:{lastUpdate:true}})
    
    if(role){
        res.status(200).json({message:'role updated'})
    }else{
        res.status(400)
        throw new Error('unable to change role user')
    }


})





//@desc use to change password
//@route PUT /api/users/change-password
//@protected
//@access owner of account
const  changePassword = asyncHandler( async (req, res) =>{
    const { oldpassword, newpassword } = req.body;

    if(!oldpassword || !newpassword){
        res.status(400)
        throw new Error('please fill all fields')
    }

    //get user old password
    const user = await Users.findById(req.user.id);

    if(await bcrypt.compare(oldpassword, user.password)){

        //hash new password
        const salt = await bcrypt.genSalt(10);
        const hashNewPassword = await bcrypt.hash(newpassword, salt);

        const cp = await Users.updateOne(
            {_id:user.id},
            {$set:{password:hashNewPassword}}, 
            {$currentDate:{lastUpdate:true}}
            )

            if(cp){
                res.status(200).json({message:`password changed successfully, kindly proceed to login`})

            }else{
                res.status(400)
                throw new Error('unable to change password')
            }
    }else{
        res.status(400)
        throw new Error('incorrect old password')
    }
    
})



const changepassword = asyncHandler( async (req, res) =>{
    const { code, newpassword } = req.body;

    if(!code || !newpassword){
        res.status(400)
        throw new Error('please fill all fields')
    }

    //hash new password
    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(newpassword, salt);


        const cp = await Users.findOneAndUpdate(
            {forgetPasswordcode:code},
            {$set:{password:hashNewPassword, forgetPasswordcode:''}}, 
            {$currentDate:{lastUpdate:true}}
            )

            if(cp){
                res.status(200).json({message:'password has been changed successfully'})
            }else{
                res.status(401)
                throw new Error('unable to change password')
            }

    
})

//@desc use to delete account
//@route DELETE /api/users/
//@protected
//@access owner of account
const  deleteUser = asyncHandler( async (req, res) =>{
    
    const deleteMySelf = await Users.findByIdAndDelete(req.user.id)

    if(deleteMySelf){
        res.status(200).json({message:'we hate to see you go, but your account has been deleted successfully'})
    }else{
        res.status(401)
        throw new Error('unable to delete your account')
    }


})


const  verifyemail = asyncHandler( async (req, res) =>{
    const { vid } = req.body;

    if(!vid){
        res.status(400)
        throw new Error('bad request')
    }

   

    //get user old password
    const user = await Users.findOneAndUpdate({verificationStatus:vid}, {$set:{verificationStatus:'verified'}},{$currentDate:{lastUpdate:true}});

    if(user){
        res.status(200).json({message:'email verified successfully'})
    }else{
        res.status(400)
        throw new Error('unable to verify email')
    }

    
})




const  forgetPassword = asyncHandler( async (req, res) =>{
    const { email } = req.body;

    if(!email){
        res.status(400)
        throw new Error('bad request')
    }
    const passwordToken = Math.random().toString(36).substring(2);
   

    //get user old password
    const user = await Users.findOneAndUpdate({email}, {$set:{forgetPasswordcode:passwordToken}},{$currentDate:{lastUpdate:true}});

    if(user){

        const link = `http://localhost:3000/changepassword/${passwordToken}`
        const message = `kindly change your password with this link ${link}`
        const subject = 'Forget Password'

        await main(user.email, message, subject).catch(err=>{
            // console.log(err)
        });
        res.status(200).json({message:'a change password link has been sent to your mail'})
    }else{
        res.status(400)
        throw new Error('unable find email in our database')
    }

    
})





//@desc use to delete account by admin
//@route DELETE /api/users/:id
//@protected
//@access superAdmin and some Admin
const  deleteUserByAdmin = asyncHandler( async (req, res) =>{

    const deleteUser = await Users.findByIdAndDelete(req.params.id)
    if(deleteUser){
        res.status(200).json({message:'user has been deleted successfully'})
    }else{
        res.status(400)
        throw new Error('unable to delect user')
    }
    
})

module.exports = {
    getAllAdmin,
    getAlluser,
    getPersonalProfile,
    getPublicProfile,
    setAllUsers,
    setUser,
    editUser,
    blockUser,
    changePassword,
    deleteUser,
    deleteUserByAdmin,
    searchAllAdmin,
    searchAlluser,
    changeRole,
    verifyemail,
    forgetPassword,
    changepassword

}
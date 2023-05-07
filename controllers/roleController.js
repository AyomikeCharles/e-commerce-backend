const asyncHandler = require('express-async-handler');
const Roles = require('../models/roleModel')


//@desc use to get all roles
//@route GET /api/roles/
//@protected
//@access SuperAdmin
const  getRole = asyncHandler( async (req, res) =>{
    const roles = await Roles.find()
    if(roles){
        res.status(200).json(roles)
    }else{
        res.status(400)
        throw new Error('unable to fetch roles')
    }

})

//@desc use to add roles
//@route POST /api/role/
//@protected
//@access superAdmin
const  addRole = asyncHandler( async (req, res) =>{
    //check if empty value was sent
    const { value, path }  = req.body

    if(!value){
        res.status(400)
        throw new Error('please fill the required field')
    }

    //check if role already exist
    const roleExist = await Roles.findOne({value})
    if(roleExist){
        res.status(400)
        throw new Error('this role already exist')
    }

    //create role
    const role = await Roles.create({
        value,
        path
    })

    if(role){
        res.status(200).json({message:'role has been created successfully'})
    }else{
        res.status(400)
        throw new Error('unable to creat role')
    }


})

module.exports = {
    getRole,
    addRole

}
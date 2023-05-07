
const asyncHandler = require('express-async-handler');
const State = require('../models/stateModels')
const Lgas = require('../models/lgaModel')


//@desc use to get all categories
//@route GET /api/categories/
//@not protected
//@access all users
const  getStates = asyncHandler( async (req, res) =>{
    const state = await State.find().select('-createdAt').select('-updatedAt').select('-__v')
    if(state){
        res.status(200).json(state)
    }else{
        res.status(400)
        throw new Error('unable to fetch states')
    }

})


const  getState = asyncHandler( async (req, res) =>{
    const state = await State.findById(req.params.id)
    if(state){
        res.status(200).json(state)
        
    }else{
        res.status(400)
        throw new Error('unable to fetch this state')
    }
})




//@desc use to add category
//@route POST /api/categories/
//@protected
//@access superAdmin
const  addState = asyncHandler( async (req, res) =>{
    //check if empty value was sent
    const { state, price, region }  = req.body


    if(!state || !price || !region){
        res.status(400)
        throw new Error('bad request')
    }

    //check if state exist
    const stateExist = await State.findOne({state})

    if(stateExist){
        res.status(400)
        throw new Error('this state already exist')
    }

    const createState = await  State.create({
        state,
        price,
        region
    })

    if(createState){
        res.status(200).json(createState)
    }else{
        res.status(400)
        throw new Error('unable to create state')
    }

})

const  editState = asyncHandler( async (req, res) =>{
    //check if empty value was sent
    const { state, price, region }  = req.body
    const stateExist = await State.findById(req.params.id)
    if(!stateExist){
        res.status(400)
        throw new Error('this state does not exist, you should create a new state instead')
    }

    let newState = ''
    let newPrice = ''
    let newRegion = ''

    if(!state){
        newState = stateExist.state
    }else{
        newState = state
    }

    if(!price){
        newPrice = stateExist.price
    }else{
        newPrice = price
    }

    if(!state){
        newRegion = stateExist.region
    }else{
        newRegion = region
    }


    const update = await  State.findByIdAndUpdate(req.params.id, {state:newState, price:newPrice, region:newRegion}, {$CurrentDate:{lastUpdate:true}})

    if(update){
        res.status(200).json({message:'state has been updated'})
    }else{
        res.status(400)
        throw new Error('unable to update state') 
    }

})



const deleteState = asyncHandler( async (req, res) =>{
    


    const deleteState = await State.findByIdAndDelete(req.params.id)
    const deleteLgas = await Lgas.findOneAndDelete({State:req.params.id})


    if(deleteState && deleteLgas){
        res.status(200).json({message:'state has been deleted'})
    }else{
        res.status(400)
        throw new Error('unable to delete state') 
    }

})




module.exports = {

    getStates,
    getState,
    addState,
    editState,
    deleteState
    
}
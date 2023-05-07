
const asyncHandler = require('express-async-handler');
const Lgas = require('../models/lgaModel')


// ['Akoko-Edo', 'Egor', 'Esan Central',
// 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba Okha', 'Orhionmwon', 'Oredo', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde']


const  getLgaByState = asyncHandler( async (req, res) =>{

    
    const lgas = await Lgas.findOne({state:req.params.stateId})

    
    if(lgas){
        res.status(200).json(lgas)
        
    }else if(lgas === null){
        res.status(200).json(null)
    }else{
        res.status(400)
        throw new Error('unable to fetch this lga')
    }

})




//@desc use to add category
//@route POST /api/categories/
//@protected
//@access superAdmin
const  addLgas = asyncHandler( async (req, res) =>{
    //check if empty value was sent
    const { lgas, state }  = req.body


    if(!lgas || !state){
        res.status(400)
        throw new Error('bad request')
    }

    //check if state exist
    const lgaExist = await Lgas.findOne({lgas})

    if(lgaExist){
        res.status(400)
        throw new Error('this lga already exist')
    }

    const createLgas = await Lgas.create({
        lgas,
        state,
  
    })

    if(createLgas){
        res.status(200).json(createLgas )
    }else{
        res.status(400)
        throw new Error('unable to create lgas')
    }

})

const  editLgas = asyncHandler( async (req, res) =>{
    //check if empty value was sent
    const { lgas }  = req.body
    const lgaExist = await Lgas.findById(req.params.stateId)

    if(!lgaExist){
        res.status(400)
        throw new Error('this lga does not exist, you should create a new lga instead')
    }

    let newLga = ''

    if(!lgas){
        newLga = lgaExist.lgas
    }else{
        newLga = lgas
    }

   


    const update = await  Lgas.findByIdAndUpdate(req.params.stateId, {lgas:newLga}, {$CurrentDate:{lastUpdate:true}})

    if(update){
        res.status(200).json({message:'lga has been updated'})
    }else{
        res.status(400)
        throw new Error('unable to update lga') 
    }

})





module.exports = {

    getLgaByState,
    addLgas,
    editLgas,
    
}
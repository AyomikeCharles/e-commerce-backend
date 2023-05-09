const Sales = require('../models/salesModel')
const asyncHandler = require('express-async-handler')
const Roles = require('../models/roleModel')
const jwt = require('jsonwebtoken')
const main = require('../nodemailer') 
// const https = require('https')
const axios = require('axios')



const getSales = asyncHandler(async (req, res)=>{

    let limit = 25;
    let skip = 0;

    let { search } = req.params
    if(!search){
        search = ''
    }

    if(req.params.limit !== "undefined"){
        limit = req.params.limit
    }

    if(req.params.skip !== "undefined"){
        skip = req.params.skip
    }


    const count = await Sales.countDocuments({$or:[{ paymentStatus: { $regex: search, $options: 'i' } },{personalDetails:{ $elemMatch: { $regex:search, $options: 'i' }}}, { transactionStatus: { $regex: search, $options: 'i' } }]});
    const sales = await Sales.find({$or:[{ paymentStatus: { $regex: search, $options: 'i' } },{personalDetails:{ $elemMatch: { $regex:search, $options: 'i' }}}, { transactionStatus: { $regex: search, $options: 'i' } }]}).limit(limit).skip(skip).select('-__v')

    if(sales){
        res.status(200).json({data:sales, total:count})
    }else{
        res.status(400)
        throw new Error('unable to get sales')
    }


})





const getCompletedSales = asyncHandler(async (req, res)=>{


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

    const count = await Sales.countDocuments({$and:[{transactionStatus:'completed'}, {$or: [{personalDetails:{ $elemMatch: { $regex:search, $options: 'i' }}},{ CreateAt: { search } }]}]});
    const sales = await Sales.find({$and:[{transactionStatus:'completed'}, {$or: [{personalDetails:{ $elemMatch: { $regex:search, $options: 'i' }}},{ CreateAt: { search } }]}]}).limit(limit).skip(skip).select('-__v')

    if(sales){
        res.status(200).json({data:sales, total:count})
    }else{
        res.status(400)
        throw new Error('unable to get invoice')
    }

})






const getUserSales = asyncHandler(async (req, res)=>{

    let limit = 25;
    let skip = 0;

    let { search } = req.params
    if(!search){
        search = ''
    }

    if(req.params.limit !== "undefined"){
        limit = req.params.limit
    }

    if(req.params.skip !== "undefined"){
        skip = req.params.skip
    }


    const count = await Sales.countDocuments({$and: [{user:req.user.id}, {$or:[{ paymentStatus: { $regex: search, $options: 'i' } },{personalDetails:{ $elemMatch: { $regex:search, $options: 'i' }}}, { transactionStatus: { $regex: search, $options: 'i' } }]}]});
    const sales = await Sales.find({$and: [{user:req.user.id}, {$or:[{ paymentStatus: { $regex: search, $options: 'i' } },{personalDetails:{ $elemMatch: { $regex:search, $options: 'i' }}}, { transactionStatus: { $regex: search, $options: 'i' } }]}]}).limit(limit).skip(skip).select('-__v')

    if(sales){
        res.status(200).json({data:sales, total:count})
    }else{
        res.status(400)
        throw new Error('unable to get sales')
    }


})







const getOneSales = asyncHandler(async (req, res)=>{

    
    const sale = await Sales.findById(req.params.id)

    if(sale){
        res.status(200).json(sale)
    }else{
        res.status(400)
        throw new Error('unable to get sale')
    }


})

const setSales = asyncHandler(async (req, res)=>{
    const { name,
    email,
    phoneNumber,
    whatsapp,
    state,
    stateName,
    lga,
    address,
    moreDetails,
    products,
    shippingPrice,
    subtotal} = req.body


    let userid

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        accessToken = req.headers.authorization.split(' ')[1]

        const decode = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN)
        //get user and role
        userid  = decode.id
        const roles = await Roles.findById(decode.role)
        const role = roles.value

        

        // if(role === '69t8@8h7rj6' || role === '5ry5@9%96'){
        //     res.status(400)
        //     throw new Error('you are not allowed to carry out this operation')
        // }
            
    }

    


    if(!name || !email || !phoneNumber || !whatsapp || !state || !stateName || !lga ||!address || !products || !shippingPrice || !subtotal){
        res.status(400)
        throw new Error('please fill all field')
    }


    const sales = await Sales.create({
        user:userid,
        shipping:[stateName,lga,address],
        moreDetails,
        personalDetails:[name, email, phoneNumber, whatsapp],
        products,
        shippingPrice,
        subtotal,
        total:shippingPrice*subtotal
    })

    if(sales){
        const link = `http://localhost:3000/payment/${sales._id}`
        const message = `you have made an order with ID:${sales._id}, you can make payment with this link ${link}, kindly ingnore if you has already made payment`
        const subject = 'Your Order'

        await main(sales.personalDetails[1], message, subject).catch(err=>{
            // console.log(err)
        });
        res.status(200).json(sales)
    }else{
        res.status(400)
        throw new Error('unable to add sales')
    }
})


const updateSalesStatus = asyncHandler(async (req, res)=>{

    const { value } = req.body

    const updateSale = await Sales.findByIdAndUpdate(req.params.id, {transactionStatus:value}, {$CurrentDate:{lastUpdate:true}})

 
    if(updateSale){
        res.status(200).json(updateSale)
    }else{
        res.status(400)
        throw new Error('unable to update sale')
    }


})




const getUserCompletedSales = asyncHandler(async (req, res)=>{


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

    const count = await Sales.countDocuments({$and:[{user:req.user.id}, {transactionStatus:'completed'}, {$or: [{personalDetails:{ $elemMatch: { $regex:search, $options: 'i' }}},{ CreateAt: { search } }]}]});
    const sales = await Sales.find({$and:[{user:req.user.id}, {transactionStatus:'completed'}, {$or: [{personalDetails:{ $elemMatch: { $regex:search, $options: 'i' }}},{ CreateAt: { search } }]}]}).limit(limit).skip(skip).select('-__v')

    if(sales){
        res.status(200).json({data:sales, total:count})
    }else{
        res.status(400)
        throw new Error('unable to get invoice')
    }

})





const updatePayment = asyncHandler(async (req, res) => {
    // Make an HTTP request to verify the transaction

    const { ref } = req.body


   

    const options = {
        method: 'GET',
        url: `https://api.paystack.co/transaction/verify/${ref}`,
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        }
      };
      
       axios(options)
        .then(async response => {
          if( response.data.data.status === 'success'){
            
            const updateSale = await Sales.findByIdAndUpdate(ref, {paymentStatus:'paid'}, {$CurrentDate:{lastUpdate:true}})

            if(updateSale){
                res.status(200).json({message:'payment has be confirm'})
            }else{
                res.status(400)
                throw new Error('payment has been confirm but unable to update payment status, we will get back to you shortly')
            }
          }else{
            res.status(200).json({message:`your payment status was ${response.data.data.status}, kindly contact us`})
          }
        })
        .catch(error => {
            res.status(400)
            throw new Error(`unable to verify this transaction, due to the following error ${error}, kindly contact us`)
        });
    

  });



module.exports = {
    getSales,
    setSales,
    getOneSales,
    updateSalesStatus,
    getCompletedSales,
    getUserSales,
    getUserCompletedSales,
    updatePayment
}
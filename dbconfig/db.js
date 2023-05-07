const mongoosee = require('mongoose')
const uri = process.env.ATLAS_URI

const DataBaseConfig = async () => {
    try{
        const conn = mongoosee.connect(uri)
        console.log(`connected to database`)
    }catch(err){
        console.log(err)
        process.exit(1)
    }

}

module.exports =  DataBaseConfig 
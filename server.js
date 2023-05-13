const express = require('express');
const dotenv = require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const  DataBaseConfig  = require('./dbconfig/db')
const { errorHandler } = require('./middlewares/errorHandler')
const cluster = require('cluster')
const os = require('os')
const compression = require('compression')
const cloudinary = require('cloudinary').v2;


// Configurating cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const app = express()
DataBaseConfig();
const port = process.env.PORT || 5000
const numCpu = os.cpus().length;





app.use(compression({
    level:6,
    threshold: 0,
}))
app.use(cors({
    credentials: true,
    origin:'https://brezzy.netlify.app/'//change to frontend url later
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/users', require('./routes/usersRoute'))
app.use('/api/roles', require('./routes/roleRoute'))
app.use('/api/categories', require('./routes/categoriesRoute'))
app.use('/api/products', require('./routes/productsRoute'))
app.use('/api/states', require('./routes/statesRoute'))
app.use('/api/lga', require('./routes/lgaRoute'))
app.use('/api/sales', require('./routes/salesRoute'));
app.use('/api/wishlist', require('./routes/wishlistRoute'));
app.use('/api/refreshToken', require('./routes/refreshTokenRoute'));
app.use('/api/logout', require('./routes/logoutRoute'));
app.use(errorHandler)


if(cluster.isMaster){
    for(let i = 0; i < numCpu; i++){
        cluster.fork()
    }

    cluster.on('exit', (work, code, signal)=>{
        cluster.fork()
    })
}else{

    app.listen(port, ()=>{
        console.log(`server is running on port ${port} with ${numCpu} cpu`)
    })
}


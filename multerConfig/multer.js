const multer = require('multer')

// Configure Multer storage engine
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}`)
    },
    
  });

  const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/svg' || file.mimetype === 'image/avif'){
        cb(null, true)
    }else{
        cb({message:'unsupported file format in one or more images'}, false)
    }
  }

  const upload = multer({ 
    storage: storage,
    limits: {fileSize:2000000},
    fileFilter:fileFilter 
})

module.exports = upload
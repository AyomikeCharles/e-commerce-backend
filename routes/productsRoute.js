const express = require('express')
const router = express.Router()
const upload = require('../multerConfig/multer')

const {
    getProduct,
    getProducts,
    getProductsByCategory,
    getProductsBySearch,
    addProduct,
    editProducts,
    deleteProducts
} = require('../controllers/productsController')


const { authorized } = require('../middlewares/authorizeMw')
const { authorizedRoles } = require('../middlewares/authorizeRoleMw')


router.route('/category/:catid/:limit?/:skip?').get(getProductsByCategory)
router.route('/search/:limit?/:skip?/:search?').get(getProductsBySearch)
router.route('/:id').get(getProduct).put(authorized, authorizedRoles('69t8@8h7rj6'), upload.fields([{name:'thumbnail', maxCount:1},{name:'image1', maxCount:1},{name:'image2', maxCount:1},{name:'image3', maxCount:1}]), editProducts).delete(authorized, authorizedRoles('69t8@8h7rj6'), deleteProducts)
router.route('/').post(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), upload.array('images', 4), addProduct)
router.route('/:limit?/:skip?').get(getProducts)

module.exports = router
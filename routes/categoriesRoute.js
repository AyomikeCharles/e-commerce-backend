const express = require('express')
const router = express.Router()
const upload = require('../multerConfig/multer')

const {
    addCategory,
    getCategories,
    getCategory,
    editCategory
} = require('../controllers/categoriesController')

const { authorized } = require('../middlewares/authorizeMw')
const { authorizedRoles } = require('../middlewares/authorizeRoleMw')

//create new role and get all role

router.route('/:id').put(authorized, authorizedRoles('69t8@8h7rj6'), upload.single('icon'), editCategory).get(authorized, authorizedRoles('69t8@8h7rj6'), getCategory)
router.route('/').post(authorized, authorizedRoles('69t8@8h7rj6'), upload.single('icon'), addCategory).get(getCategories)


module.exports = router
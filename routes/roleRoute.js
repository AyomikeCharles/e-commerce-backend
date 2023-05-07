const express = require('express')
const router = express.Router()

const {
    addRole,
    getRole
} = require('../controllers/roleController')

const { authorized } = require('../middlewares/authorizeMw')
const { authorizedRoles } = require('../middlewares/authorizeRoleMw')

//create new role and get all role
router.route('/').post(authorized, authorizedRoles('69t8@8h7rj6'), addRole).get(authorized, authorizedRoles('69t8@8h7rj6'), getRole)



module.exports = router
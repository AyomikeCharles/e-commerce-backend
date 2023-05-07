const express = require('express')
const router = express.Router()

const {
    getLgaByState,
    addLgas,
    editLgas
} = require('../controllers/lgaController')

const { authorized } = require('../middlewares/authorizeMw')
const { authorizedRoles } = require('../middlewares/authorizeRoleMw')


router.route('/:stateId?').get(getLgaByState).put(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), editLgas)
router.route('/').post(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), addLgas)


module.exports = router
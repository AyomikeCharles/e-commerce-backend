const express = require('express')
const router = express.Router()

const {
    getState,
    getStates,
    addState,
    editState,
    deleteState
    
} = require('../controllers/stateController')

const { authorized } = require('../middlewares/authorizeMw')
const { authorizedRoles } = require('../middlewares/authorizeRoleMw')


router.route('/:id').put(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), editState).get(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), getState).delete(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), deleteState)
router.route('/').post(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), addState).get(getStates)


module.exports = router
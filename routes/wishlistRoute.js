const express = require('express')
const routes = express.Router()
const { getWishlist, addWishlist, removeItem } = require('../controllers/wishlistController')
const { authorized } = require('../middlewares/authorizeMw')
const { authorizedRoles } = require('../middlewares/authorizeRoleMw')

routes.route('/:userid').get(authorized, authorizedRoles('y56d3#45c'), getWishlist)
routes.route('/').post(authorized, authorizedRoles('y56d3#45c'), addWishlist)
routes.route('/:id').put(authorized, authorizedRoles('y56d3#45c'), removeItem)

module.exports = routes
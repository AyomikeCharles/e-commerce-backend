const express = require('express')
const router = express.Router()

const { authorized } = require('../middlewares/authorizeMw')
const { authorizedRoles } = require('../middlewares/authorizeRoleMw')

const {
    getSales,
    setSales,
    getOneSales,
    updateSalesStatus,
    getCompletedSales,
    getUserSales,
    getUserCompletedSales
} = require('../controllers/salesController')

router.route('/:id').get(authorized, getOneSales).put(authorized, updateSalesStatus)
router.route('/user/completed/:limit?/:skip?/:search?').get(authorized, getUserCompletedSales)
router.route('/completed/:limit?/:skip?/:search?').get(authorized, getCompletedSales)
router.route('/user/:limit?/:skip?/:search?').get(authorized, getUserSales)
router.route('/:limit?/:skip?/:search?').get(authorized, getSales)
router.route('/').post(setSales).get(authorized, getSales)

module.exports = router
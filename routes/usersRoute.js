const express = require('express')

const router = express.Router()

const {
    getAllAdmin,
    getAlluser,
    getPersonalProfile,
    getPublicProfile,
    setAllUsers,
    setUser,
    editUser,
    blockUser,
    changePassword,
    deleteUser,
    deleteUserByAdmin,
    searchAllAdmin,
    searchAlluser,
    changeRole,
    verifyemail,
    forgetPassword,
    changepassword

} = require('../controllers/usersController')

const { authorized } = require('../middlewares/authorizeMw')
const { authorizedRoles } = require('../middlewares/authorizeRoleMw')


//search for all admin
router.route('/admin/search/:limit?/:skip?').get(authorized, authorizedRoles('69t8@8h7rj6'), searchAllAdmin)



//get all admins
router.route('/admin/:limit?/:skip?').get(authorized, authorizedRoles('69t8@8h7rj6'), getAllAdmin)

//search for all users
router.route('/search/:limit?/:skip?').get(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), searchAlluser)

//change user role 
router.route('/roleupdate/:id').put(authorized, authorizedRoles('69t8@8h7rj6'), changeRole)

router.route('/verifyemail').put(verifyemail)

router.route('/forgetpassword').put(forgetPassword)

router.route('/changepassword').put(changepassword)



//view your own profile
router.route('/personal-profile').get(authorized, getPersonalProfile)

//change password
router.route('/change-password').put(authorized, changePassword)

//view users profile block users by admin delete user account by admin
router.route('/:id').get(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'), getPublicProfile).put(authorized, authorizedRoles('69t8@8h7rj6'), blockUser).delete(authorized, authorizedRoles('69t8@8h7rj6'), deleteUserByAdmin)


//get all users
router.route('/:limit?/:skip?/:search?').get(authorized, authorizedRoles('69t8@8h7rj6', '5ry5@9%96'),  getAlluser)


//login
router.route('/login').post(setUser)

//create new account, edit account, delete account by owner
router.route('/').post(setAllUsers).put(authorized, editUser).delete(authorized, deleteUser)

module.exports = router

const authorizedRoles = (...allowedRoles) => {
    return (req, res, next)=>{
        //get current user role
        if(!req.role){
            res.status(400)
            throw new Error('bad request')
        }
    
        const rolesAllowed = [...allowedRoles]

        const check = rolesAllowed.includes(req.role)


        if (!check){
            res.status(401)
            throw new Error('you are not permitted') 
        }

        next()
    }
}

module.exports = {
    authorizedRoles
}
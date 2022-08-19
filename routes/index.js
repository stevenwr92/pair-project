const routes = require('express').Router()
const Controller = require('../controller/index')


routes.get('/', Controller.home)


routes.get('/register', Controller.register)


routes.post('/register', Controller.postRegister)


routes.get('/login', Controller.login)

routes.post('/login', Controller.postLogin)

routes.use(function (req,res,next) {
    // console.log(req.session)
    if(!req.session.userId) {
        const error = 'Login first'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    } 
})

routes.get('/logout', Controller.logOut)

routes.use(function (req,res,next) {
    console.log(req.session)
    if(req.session.userId && req.session.role !== 'Admin') {
        const error = 'for Admin only'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    } 
})

//admin only

routes.get('/sellerHome', Controller.sellerHome)
routes.get('/products/:id',Controller.productByUserId)
routes.get('/products/:id/add',Controller.addProduct)
routes.post('/products/:id/add',Controller.saveProduct)
routes.get('/products/:id/edit/:id',Controller.editProduct)
routes.post('/products/:id/edit/:id',Controller.updateProduct)
routes.get('/products/:id/delete/:id',Controller.deleteProduct)


module.exports = routes


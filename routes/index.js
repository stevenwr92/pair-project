const routes = require('express').Router()
const Controller = require('../controller/index')


routes.get('/', Controller.home)
//GET register

routes.get('/register', Controller.register)


//POST register

routes.post('/register', Controller.postRegister)

// login

routes.get('/login', Controller.login)

routes.post('/login', Controller.postLogin)

routes.use(function (req,res,next) {
    console.log(req.session)
    if(!req.session.userId) {
        const error = 'Login first'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    } 
})

routes.use(function (req,res,next) {
    console.log(req.session)
    if(req.session.userId && req.session.role !== 'seller') {
        const error = 'for seller only'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    } 
})

routes.get('/sellerHome', Controller.sellerHome)
routes.get('/products/:id',Controller.productByUserId)
routes.get('/products/:id/add',Controller.addProduct)
routes.post('/products/:id/add',Controller.saveProduct)
routes.get('/products/:id/edit/:id',Controller.editProduct)
routes.post('/products/:id/edit/:id',Controller.updateProduct)
routes.get('/products/:id/delete/:id',Controller.deleteProduct)


module.exports = routes


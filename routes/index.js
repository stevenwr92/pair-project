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

routes.get('/adminHome', Controller.adminHome)


module.exports = routes


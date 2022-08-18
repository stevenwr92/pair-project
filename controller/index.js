const {User} = require('../models')
const bcrypt = require('bcryptjs')

class Controller {
    static home(req,res) {
        res.render('home')
    }

    static register(req, res) {
        const {error} = req.query
        res.render('register', {error})

    }

    static postRegister(req,res) {
       let body = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
       } 

       console.log(body)
       User.create(body)
       .then(result => {
        res.redirect('login')
       })
       .catch(err => {
        if(err.name === 'SequelizeValidationError') {
            const error = err.errors.map(el => el.message)
            res.redirect(`/register?error=${error}`)
        }else{
            res.send(err)
        }
       })
    }

    static login(req,res) {
        const {error} = req.query
        res.render('login', {error})
    }

    static postLogin(req,res) {
        const {email, password} = req.body

        User.findOne({ where: {email} })
        .then(user => {
            if(user) {
                const isValidPassword = bcrypt.compareSync(password, user.password)
                if(isValidPassword) {
                    req.session.role = user.role
                    req.session.userId = user.id
                    console.log(user)
                    if(user.role === "Admin") {
                        return res.redirect('adminHome')
                    }
                } else {
                    const error = 'wrong password'
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = 'email/password not found'
                return res.redirect(`/login?error=${error}`)
            }
        })
        .catch(err =>{
            res.send(err)
        })
    }

    static logOut(req,res) {
        req.session.destroy((err) => {
            if(err) return res.send(err)
            
            res.redirect('/')
        })
    }

    static adminHome(req,res) {
        res.render('adminHome')
    }
}

module.exports= Controller
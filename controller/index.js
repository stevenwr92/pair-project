const {User} = require('../models')
const bcrypt = require('bcryptjs')

class Controller {
    static home(req,res) {
        res.render('home')
    }

    static register(req, res) {
        res.render('register')
    }

    static postRegister(req,res) {
       let body = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
       } 

       console.log(body)
       User.create(body)
       .then(result => {
        res.redirect('login')
       })
       .catch(err => {
        res.send(err)
       })
    }

    static login(req,res) {
        const {error} = req.query
        res.render('login', {error})
    }

    static postLogin(req,res) {
        const {username, password} = req.body

        User.findOne({ where: {username} })
        .then(user => {
            if(user) {
                const isValidPassword = bcrypt.compareSync(password, user.password)
                if(isValidPassword) {

                    req.session.userId = user.id
                    req.session.role = user.role
                    return res.redirect('/sellerHome')
                } else {
                    const error = 'wrong password'
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = 'username/password not found'
                return res.redirect(`/login?error=${error}`)
            }
        })
        .catch(err =>{
            res.send(err)
        })
    }

    static sellerHome(req,res) {
        res.render('sellerhome')
    }
}

module.exports= Controller
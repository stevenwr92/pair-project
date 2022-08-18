const bcrypt = require('bcryptjs')
const {User,Product,Category}=require('../models/index')

class Controller {
    static home(req,res) {
        res.render('home')
    }
    
    static sellerHome(req,res) {
        User.findAll({
            include:Product,
            required:true
        })
        .then(result=>{
            // res.send(result)
            res.render('sellerHome', {result})
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static productByUserId(req,res){
        User.findAll({
            include:Product,
            required:true
        },{
            where:{
                id:req.params.id
            }
        })
        .then(result=>{
            let productUserId=result.forEach(el => {
                return el.Products
            });
            // res.send(productUserId)
            res.render('productByUserId',{productUserId})
        })
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

}

module.exports= Controller
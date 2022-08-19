const {User,Product,Category}=require('../models')
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
                        return res.redirect('sellerHome')
 
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
        const id=req.params.id
        User.findByPk(id,{
            include:[{
                model:Product,
                include:Category,
                required:true
            }],
            required:true
        })
        .then(result=>{
            // res.send(result)
            res.render('productByUserId',{result})
        })
    }

    static addProduct(req,res){
        const id=req.params.id
        User.findByPk(id,{
            include:[{
                model:Product,
                include:Category,
                required:true
            }],
            required:true
        })
        .then(result=>{
            res.render('addProduct', {result})
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static saveProduct(req,res){
        const {name,description,price,CategoryId,UserId}=req.body
        const{id}=req.params
        // console.log(req.params,'<<ini req.params')
        Product.create({name,description,price,CategoryId,UserId})
            .then(result=>{
                res.redirect(`/products/${id}`)
            })
            .catch(err=>{
                res.send(err)
            })
    }

    static editProduct(req,res){
        const {id}=req.params
        console.log(req.params)
        User.findAll({
            include:[{
                model:Product,
                include:Category,
                required:true,
                where:{
                    id:req.params.id
                }
            }],
            required:true
        })
        .then(result=>{
            res.send(result)
            // res.render('editProduct',{result})
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static updateProduct(req,res){
        res.send('masuk /products/edit')
    }

    static deleteProduct(req,res){
        const{id}=req.params
        console.log(req.params)
        Product.destroy({
            where:{
                id:req.params.id
            }
        })
        .then(result=>{
            res.redirect(`/products/${id}`)
        })
        .catch(err=>{
            res.send(err)
        })
    }
}

module.exports= Controller
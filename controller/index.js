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
        const id=req.params.id
        console.log(req.params,'<<dari ProductDetail')
        User.findByPk(id,{
            include:[{
                model:Product,
                include:Category,
                required:false
            }],
            required:true
        })
        .then(result=>{
            console.log(result)
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
                if(err.name==='Sequelize ValidationError'){
                    err=err.errors.map(el=>{
                      return el.message  
                    })
                }
                res.send(err)
            })
    }

    static editProduct(req,res){
        const {ProductId,id}=req.params
        console.log(req.params)
        User.findAll({
            include:[{
                model:Product,
                include:Category,
                required:true,
                where:{
                    id:ProductId
                }
            }],
            required:true
        })
        .then(result=>{
            let data=result.map(el=>{
                return el
            })
            console.log(result)
            // res.send(result)
            res.render('editProduct',{result})
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static updateProduct(req,res){
        const {name,description,price,CategoryId,UserId}=req.body
        // console.log(req.params,'<<ini req.params')
        const{id,ProductId}=req.params
        Product.update({name,description,price,CategoryId,UserId},{
            where:{
                id:req.params.ProductId
            }
        })
            .then(result=>{
                res.redirect(`/products/${id}`)
            })
            .catch(err=>{
                if(err.name==='Sequelize ValidationError'){
                    err=err.errors.map(el=>el.message)
                }
                res.send(err)
            })
    }

    static deleteProduct(req,res){
        const{id,ProductId}=req.params
        console.log(req.params,'<<dari delete')
        Product.destroy({
            where:{
                id:ProductId
            }
        })
        .then(result=>{
            res.redirect(`/products/${id}`)
        })
        .catch(err=>{
            res.send(err)
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
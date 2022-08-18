const express = require('express')
const port = process.env.PORT || 8080
const app = express()
const routes = require('./routes/index')
const session = require('express-session')


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }
  }))
app.use(routes)

app.listen(port, () => {
    console.log(`app listen on port${port}`)
})

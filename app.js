const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const PORT = process.env.PORT || 5500
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const passport = require('passport')

//Passport config
require('./config/passport')(passport)

//DB config
const db = require('./config/keys').MongoURI


// CONNECT TO MONGO
mongoose.connect(db, { useNewUrlParser: true })
.then(()=> console.log('MongoDB Connected ...'))
.catch(err => console.log(err))

// Express body parser
app.use(express.urlencoded({ extended: true }));

//express session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  
}))


//passport middleware 
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//global variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error')
    res.locals.error = req.flash('error')
    next()
})

// ejs middleware
app.use(expressLayouts)
app.set('view engine', 'ejs')


//routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))







app.listen(PORT, console.log(`server is running on port ${PORT}`))
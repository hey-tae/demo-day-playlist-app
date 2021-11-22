const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
//user model
const User = require('../models/User')


//login page
router.get('/login', (req,res)=>{
    res.render('login')
})

//register
router.get('/register', (req,res)=>{
    res.render('register')
})

//register handle
// Register
router.post('/register', (req,res)=> {
    console.log(req.body)
    const { name, email, password, password2} = req.body

    let errors = []

    //check required
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
      }

      //check password match 
      if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }

      //check password length
      if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
      }

      if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
      }else{
          //validation passed 
          User.findOne({email: email})
          .then(user => {
              if(user){
                  //user exists
                  errors.push({msg: 'email is already registerd'})
                  res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
              } else{
                  const newUser = new User({
                      name, 
                      email,
                      password
                  })

                  //hash password
                  bcrypt.genSalt(10, (err,salt)=> 
                  bcrypt.hash(newUser.password, salt, (error, hash)=> {
                      if(err) throw err;
                       //set pw to hash 
                      newUser.password = hash
                      //save user
                      newUser.save()
                      .then(user => {
                          req.flash('success_msg', 'Your are now registered, please log in')
                          res.redirect('/users/login')
                      })
                      .catch(err => console.log(err))
                  }))
              }
          })
      }




})
  
//login handle
router.post('/login', (req,res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
})


//logout handle
router.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})
module.exports = router;
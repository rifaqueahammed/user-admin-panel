var express = require('express');
const { response } = require('../app');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers');


/* GET Login page. */

router.get('/',(req, res)=>{
  if(req.session.loggedIn){
    res.redirect('/home')
  }else{
    res.render('users/loginpage',{loginERR:req.session.loginErr});
    req.session.loginErr=false
  }
});

router.post('/', (req, res) => {
  userHelpers.doLogin(req.body).then((response)=>{
    if (response.status) {
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/home')
    } else {
      req.session.loginErr='Invalid Email or Password'
      res.redirect('/')
    }
  })
});


/* GET home page. */

router.get('/home', function (req, res, next) {
  let usersession=req.session.user
  res.render('users/userhome',{usersession,user:true});
});

/* GET signup page. */

router.get('/signup', function (req, res, next) {
  res.render('users/signup');
});

router.post('/signup', (req, res) => {
  userHelpers.dosignUp(req.body).then((response) => {
    res.redirect('/')
  })

});

/* logout page. */

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/home')
});

module.exports = router;

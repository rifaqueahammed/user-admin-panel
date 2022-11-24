var express = require('express');
const { response } = require('../app');
const { getAllusers } = require('../helpers/admin-helpers');
const adminHelpers = require('../helpers/admin-helpers');
var router = express.Router();


/* GET users listing/Admin home. */
router.get('/', function (req, res, next) {
  if(req.session.adminloggedIn){

    adminHelpers.getAllusers().then((users) => {
      res.render('admin/adminhome', { users, admin: true });
    })
  }else{
     res.redirect('/admin/login')
  }
});
/* Admin login. */

router.get('/login', (req, res) => {
  if (req.session.adminloggedIn) {
    res.redirect('/admin/')
  } else {
    res.render('admin/login', { loginERRA: req.session.adminloginErr });
    req.session.adminloginErr = false
  }
});

router.post('/login', (req, res) => {
  adminHelpers.adminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminloggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin/')
    } else {
      req.session.adminloginErr = 'Invalid Email or Password'
      res.redirect('/admin/login')
    }
  })
});

/*  users Adding. */
router.get('/addUser', function (req, res) {
  if (req.session.adminloggedIn){
    res.render('admin/addUser');
  }else{
    res.redirect('/admin/login')
  }
  
});

router.post('/addUser', (req, res) => {
  adminHelpers.addUser(req.body).then((result) => {
    res.redirect('/admin/')
  })
});

/* users Deleting. */

router.get('/delete-user/:id', (req, res) => {
  let userId = req.params.id
  adminHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin/')
  })
})

/* users Editing */
router.get('/edit-user/:id', async (req, res) => {
  let userId = req.params.id
  let user = await adminHelpers.getuserDetails(userId).then((response) => {
    res.render('admin/editUser',{response})
  })
})

router.post('/edit-user/:id', (req, res) => {
  let userId = req.params.id
  adminHelpers.updateUser(userId, req.body).then((response) =>{
    res.redirect('/admin/')
  })
})

/* Admin signout */
router.get('/signout', (req, res) => {
  req.session.destroy()
  res.redirect('/admin/login')
});

module.exports = router;

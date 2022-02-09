const express = require('express');
const router=express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users=require('../controllers/user.js')
router.route('/register')
       .get(users.regget)
       .post(catchAsync(users.regpost))
router.route('/login')
       .get(users.logget)
       .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),catchAsync(users.logpost))

router.get('/logout',users.logout)
module.exports=router
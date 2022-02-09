const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const {validateReview,Isloggedin,isReviewAuthor}=require('../middleware') 
const reviews=require('../controllers/reviews.js')
const ExpressError = require('../utils/ExpressError');


router.post('/',Isloggedin,validateReview,catchAsync(reviews.revForm))
router.delete('/:reviewID',Isloggedin,isReviewAuthor,catchAsync(reviews.revdelete))
module.exports=router
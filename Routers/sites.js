const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {Isloggedin,isAuthor,validateSite}=require('../middleware') 
const sites=require('../controllers/sites.js')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
        .get(catchAsync(sites.siteindex))
        .post(Isloggedin, upload.array('image'),validateSite,catchAsync(sites.sitesave))
router.get('/new',Isloggedin,sites.sitenew)

router.route('/:id')
      .get(catchAsync(sites.siteshow))
      .put(Isloggedin,isAuthor,upload.array('image'),validateSite,catchAsync(sites.siteput))
      .delete(Isloggedin,isAuthor,catchAsync(sites.sitedelete))

router.get('/:id/edit',Isloggedin,isAuthor,catchAsync(sites.siteedit))


module.exports=router
const { adventureSiteSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const site = require('./model/tourism');
const { reviewSchema } = require('./schemas.js');
const review = require('./model/review.js');

module.exports.Isloggedin=(req,res,next)=>{
        if(!req.isAuthenticated())
        {   req.session.returnto=req.originalUrl
            req.flash('error','you must be logged in')
            return res.redirect('/login')
        }
        next()
}
module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const advsite=await site.findById(id);
   
    if(!advsite.author.equals(req.user._id))
    {
       req.flash('error','you dont have the access')
       return res.redirect(`/sites/${id}`)
    }
    next()
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewID}=req.params;
    const rev=await review.findById(reviewID);
    
    if(!rev.author.equals(req.user._id))
    {
       req.flash('error','you dont have the access')
       return res.redirect(`/sites/${id}`)
    }
    next()
}
module.exports.validateSite = (req, res, next) => {
    const { error } = adventureSiteSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

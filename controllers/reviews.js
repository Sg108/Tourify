const site = require('../model/tourism');
const review = require('../model/review');

module.exports.revForm=async (req,res)=>{
    const {id}=req.params
    const sites=await site.findById(id)
    
    const rev=new review(req.body.review)
    rev.author=req.user._id;
    sites.reviews.push(rev)
    await rev.save()
    await sites.save()
    req.flash('success','successfully created a review')
    res.redirect(`/sites/${id}`)
}
module.exports.revdelete=async(req,res)=>{
    const {id,reviewID}=req.params;
    await site.findByIdAndUpdate(id,{$pull:{reviews : reviewID}})
    await review.findByIdAndDelete(reviewID);
    req.flash('success','successfully deleted the review')
    res.redirect(`/sites/${id}`)
}
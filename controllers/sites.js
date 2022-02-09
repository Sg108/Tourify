const site = require('../model/tourism')
const { cloudinary } = require("../cloudinary/index")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken=process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapboxToken});

module.exports.siteindex=async (req,res)=>{
    const sites=await site.find();
    res.render('sites/index',{sites})
}
module.exports.sitenew=(req,res)=>{
    
    res.render('sites/new')
}
module.exports.sitesave=async (req,res)=>{
    const geoData=await geocoder.forwardGeocode({
        query: req.body.site.location,
        limit: 1

    }).send()


    const sites=new site(req.body.site)
    sites.author=req.user._id
    sites.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    sites.geometry = geoData.body.features[0].geometry

    await sites.save()
    console.log(sites)
    req.flash('success','successfully created a new site')
    res.redirect(`sites/${sites._id}`)
}
module.exports.siteshow=async (req,res)=>{
    const {id}=req.params;
    const sites=await site.findById(id).populate({
        path:'reviews',
        populate: {
          path:'author'
        }
    }).populate('author');
    if(!sites)
    {
        req.flash('error','cannot find that site')
        return res.redirect('/sites')
    }
   
    res.render('sites/show',{sites})
   }
module.exports.siteedit=async (req,res)=>{
    const {id}=req.params;
 const sites=await site.findById(id);
 if(!sites)
 {
     req.flash('error','cannot find that site')
     return res.redirect('/sites')
 }
 res.render('sites/edit',{sites})
}
module.exports.siteput=async (req,res)=>{
    const sites=await site.findByIdAndUpdate(req.params.id,{...req.body.site})
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    sites.images.push(...imgs);
    await sites.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await sites.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','successfully updated the site')
    res.redirect(`/sites/${req.params.id}`)
}
module.exports.sitedelete=async (req,res)=>{
    const {id}=req.params
    const sites=await site.findByIdAndDelete(id)
    req.flash('success','successfully deleted a new site')
    res.redirect('/sites')
}
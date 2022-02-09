const User = require('../model/authenticate');


module.exports.regget=(req,res)=>{
    res.render('users/register')
}
module.exports.regpost=async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const user=new User({username,email})
        const registereduser=await User.register(user,password)
        req.login(registereduser,(err)=>{
            if(err) {
                return next(err)
            }
            req.flash('success','Welcome!');
            res.redirect('/sites')

        })
        // req.flash('success','thankyou for registering')
        // return res.redirect('sites')

    }
    catch(e){

         req.flash('error',e.message)
         return res.redirect('register')
    }
}
module.exports.logget=(req,res)=>{
    res.render('users/login')
}
module.exports.logpost=async(req,res)=>{
    req.flash('success','welcome back!')
    const redirectUrl=req.session.returnto||'/sites'
    delete req.session.returnto
    res.redirect(redirectUrl)
}
module.exports.logout=(req,res)=>{
    req.logout()
    req.flash('success','goodbye!')
    res.redirect('/sites')
}
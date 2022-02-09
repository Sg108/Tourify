if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const session=require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate')
const userRoutes = require('./Routers/User');
const siteRoutes = require('./Routers/sites');
const reviewRoutes = require('./Routers/reviews');
const flash=require('connect-flash')
const passport=require('passport')
const LocalStrategy = require('passport-local');
const User = require('./model/authenticate');
const mongoSanitize = require('express-mongo-sanitize');
const app=express()
const helmet=require('helmet')
const mongoDBstore=require('connect-mongo')
const dbUrl=process.env.DB_URL

//mongodb://localhost:27017/adventure_tourism
mongoose.connect('mongodb://localhost:27017/adventure_tourism',{
    useNewUrlParser: true,
  
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs',ejsMate)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// const store=new mongoDBstore({
//     url:dbUrl,
//     secret:'thisshouldbeasecret',
//     touchAfter:24*60*60
// })
// store.on("error",function(e){
//     console.log("session store error",e)
// })
const sessionconfig={
    store:mongoDBstore.create({mongoUrl:'mongodb://localhost:27017/adventure_tourism'}),
    resave:false,
    secret:'we',
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionconfig))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
 app.use(flash())
 app.use(helmet())
 const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvsq3zmlc/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use( (req,res,next)=>{
    res.locals.currentuser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})




app.get('/',(req,res)=>{
    res.render('home')
})
app.use('/', userRoutes);
app.use('/sites',siteRoutes)
app.use('/sites/:id/review',reviewRoutes)




 app.use((err, req, res, next) => {

     const { statusCode = 500 } = err;
     if (!err.message) err.message = 'Oh No, Something Went Wrong!'
     res.status(statusCode).render('error', { err })
})


app.listen(8000, () => {
    console.log('Serving on port 8000')
})
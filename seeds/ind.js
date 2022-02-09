const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const site = require('../model/tourism');

mongoose.connect('mongodb://localhost:27017/adventure_tourism', {
    useNewUrlParser: true,
  
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await site.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new site({
            //YOUR USER ID
            author:'615c5500da096f6940942c71',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!' ,
            
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dvsq3zmlc/image/upload/v1634378505/YelpCamp/load_dvwsnp.jpg',
                    filename: 'YelpCamp/load_dvwsnp.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/dvsq3zmlc/image/upload/v1634378514/YelpCamp/d_vka24n.jpg',
                    filename: 'YelpCamp/d_vka24n.jpg'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

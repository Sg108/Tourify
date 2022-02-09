const mongoose=require('mongoose')
const Review = require('./review')

const schema=mongoose.Schema


const ImageSchema = new schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const opts = { toJSON: { virtuals: true } };
const adventureSiteSchema=new schema({
    title: String,
    price: String,
    description: String,
    location: String,
    images: [ImageSchema],
    author:{
        
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

},opts);
adventureSiteSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/sites/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 40)}...</p>`
});

adventureSiteSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('adventureSite',adventureSiteSchema)
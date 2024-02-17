const mongoose = require('mongoose')
const DB =process.env.DATABASE_LOCAL;

mongoose.set('strictQuery', false);
mongoose.connect(DB).then(con=>{
    console.log("Succesfully connected DB")
})


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Tour must have name!"],
        unique: true,
        trim: true,
    },
    duration: {
        type: Number,
        require: [true, "Tour must have duration!"]
    },
    maxGroupSize:{
        type: Number,
        require: [true, "Group must have max Size!"]
    },
    difficulty: {
        type: String,
        require: [true, "Tour must have difficulty!"]
    },

    ratingAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },

    price: {
        type: Number,
        require: [true, "Tour must have a price"],

    },

    priceDiscount: Number,
    summary:{
        type: String,
        trim: true,
        require: [true, "Summary is required!"],
    },
    descrption: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "Cover image is required!"],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
})


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
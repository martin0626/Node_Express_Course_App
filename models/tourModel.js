const mongoose = require('mongoose')
const DB =process.env.DATABASE_LOCAL;

mongoose.set('strictQuery', false);
mongoose.connect(DB).then(con=>{
    console.log("Succesfully connected DB")
})


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Tour must have name"],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        require: [true, "Tour must have a price"],

    },
})


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
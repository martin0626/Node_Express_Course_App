const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Adding Enviroment Variables For config.env file
dotenv.config({path: './config.env'})

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


const newTour = new Tour({
    name: "New Tour Third",
    price: 122,
})

newTour.save().then(doc=>{
    console.log(doc)
}).catch(err=>{
    console.log('Error:', err)
});

const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("App runing on port " + port + " ...");
})
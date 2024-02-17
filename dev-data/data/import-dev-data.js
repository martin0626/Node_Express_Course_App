const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB)
  .then(() => {
    console.log('Connected to MongoDB');
    // Your code here
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });



mongoose.connect(DB).then(con=>{
    console.log("Succesfully connected DB")
})


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`), "utf-8");

const importData = async ()=>{
    try {
        await Tour.create(tours);
        console.log("Data Successfully loaded!");
    }catch(error){
        console.log(error);
    }
}

importData()
const deleteData = async()=>{
    try {
        await Tour.deleteMany();
        console.log("Data Successfully Deleted!");
    }catch(error){
        console.log(error);
    }
}

if(process.argv[2] == '--import'){
    importData();
}else if (process.argv[2]== '--delete'){
    deleteData();
}

// TODO Make it work!!!
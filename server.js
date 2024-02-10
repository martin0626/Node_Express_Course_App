const dotenv = require('dotenv');

//Adding Enviroment Variables For config.env file
dotenv.config({path: './config.env'})




const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("App runing on port " + port + " ...");
})
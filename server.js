const dotenv = require('dotenv');

//Adding Enviroment Variables For config.env file
dotenv.config({path: './config.env'})




const app = require('./app');
const port = process.env.PORT || 3000;

const server = app.listen(port, ()=>{
    console.log("App runing on port " + port + " ...");
})

process.on('unhandledRejection', err=>{
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down...');

    server.close(()=>{
        process.exit(1);
    })

})
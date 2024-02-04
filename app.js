//Importing all external libraries
const fs = require('fs');   
const express = require('express');

//Express
const app = express();


// Middleware for reading json body for post requests
app.use(express.json());
// Custom Middleware:
app.use((req, res, next)=>{
    console.log("Hello from middleware 👌❤️");

    //Adding property to request object for all Urls
    req.addedProp = 'Succesfully added!😉'

    next();
})


//Reading files: 
//'tours-simple.json' with all tours
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
//'users.json' with all users
const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`))



// TOURS API

const getAllTours = (req, res)=>{
    console.log(req.addedProp);
    res.status(200).json({
        status: "Success",
        results: tours.length,
        data: {tours},
    });
};

const getSingleTour = (req, res)=>{
    let params = req.params;
    let tour = tours.filter((t)=>{return t.id == params.id})
    
    tour.length > 0 
    ?
    res.status(200).json({
        status: "Success",
        results: tour,
    }) 
    :
    res.status(404).json({
        status: "Not found",
        message: "Invalid ID",
    })
};

const createTour = (req, res)=>{
    console.log(req.body);
    let newId = tours[tours.length - 1].id + 1;
    let newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: "Success", 
                data: {tour: newTour}
            });
        }
    );
};


const updateTour = (req, res)=>{
    let params = req.params;
    let tour = tours.filter((t)=>{return t.id == params.id})
    
    tour.length > 0 
    ?
    res.status(200).json({
        status: "Success",
        results: "Updated Tour Here",
    }) 
    :
    res.status(404).json({
        status: "Not found",
        message: "Invalid ID",
    })
};

const deleteTour = (req, res)=>{
    let params = req.params;
    const toursLen = tours.length;
    let newTours = tours.filter((t)=>{return t.id != params.id})
    
    newTours.length != toursLen
    ?
    res.status(204).json({
        status: "Success",
        results: null,
    }) 
    :
    res.status(404).json({
        status: "Not found",
        message: "Invalid ID",
    })
};


app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);
app.route('/api/v1/tours/:id')
    .get(getSingleTour)
    .patch(updateTour)
    .delete(deleteTour);


//USERS API 

const getAllUsers = (req, res)=>{
    res.status(200).json(
        {
            status: 'Success',
            results: users.length,
            body: {users},
        }
    )
}


const createUser = (req, res)=>{
    
    let newId = users[users.length - 1]._id + 1;
    let newUser = Object.assign({_id: newId}, req.body);
    users.push(newUser);

    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        err => {
            res.status(201).json({
                status: "Success", 
                data: {tour: newUser}
            });
        }
    );
};

const getSingleUser = (req, res)=>{
    let params = req.params;
    let user = users.filter((t)=>{return t._id == params.id})
    
    user.length > 0 
    ?
    res.status(200).json({
        status: "Success",
        results: user,
    }) 
    :
    res.status(404).json({
        status: "Not found",
        message: "Invalid ID",
    })
};


const updateUser = (req, res)=>{
    let params = req.params;
    let user = users.filter((t)=>{return t._id == params.id})
    
    user.length > 0 
    ?
    res.status(200).json({
        status: "Success",
        results: "Updated user Here",
    }) 
    :
    res.status(404).json({
        status: "Not found",
        message: "Invalid ID",
    })
};


const deleteUser = (req, res)=>{
    let params = req.params;
    const usersLen = users.length;
    let newUsers = users.filter((t)=>{return t._id != params.id})
    
    newUsers.length != usersLen
    ?
    res.status(204).json({
        status: "Success",
        results: null,
    }) 
    :
    res.status(404).json({
        status: "Not found",
        message: "Invalid ID",
    })
};


app.route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser);
app.route('/api/v1/users/:id')
    .get(getSingleUser)
    .patch(updateUser)
    .delete(deleteUser);



// Home Page API
app.get('/', (req, res)=>{
    res.status(404).json({message: "Message Complete", id: 2});
});


app.post('/', (req, res)=>{
    res.json({message: "You posted successfully!", id: 2});
});



// APP Set UP
const port = 3000;

app.listen(port, ()=>{
    console.log("App runing on port " + port + " ...");
})
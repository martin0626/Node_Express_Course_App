const fs = require('fs');   


//'tours-simple.json' with all tours
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.checkId = (req, res, next, val)=>{
    const tour = tours.filter(t=> {return t.id == val});
    
    if(tour.length === 0){
        return res.status(404).json({
            status: "Not found",
            message: "Invalid ID",
        })
    }

    next();

}


exports.getAllTours = (req, res)=>{
    console.log(req.addedProp);
    res.status(200).json({
        status: "Success",
        results: tours.length,
        data: {tours},
    });
};

exports.getSingleTour = (req, res)=>{
    
    const tour = tours.filter(t=>{return req.params.id == t.id})
    res.status(200).json({
        status: "Success",
        results: tour,
    }) 
};

exports.createTour = (req, res)=>{
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


exports.updateTour = (req, res)=>{
    res.status(200).json({
        status: "Success",
        results: "Updated Tour Here",
    }) 
};

exports.deleteTour = (req, res)=>{
    res.status(204).json({
        status: "Success",
        results: null,
    }) 
};
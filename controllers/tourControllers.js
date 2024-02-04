const fs = require('fs');   


//'tours-simple.json' with all tours
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.getAllTours = (req, res)=>{
    console.log(req.addedProp);
    res.status(200).json({
        status: "Success",
        results: tours.length,
        data: {tours},
    });
};

exports.getSingleTour = (req, res)=>{
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

exports.deleteTour = (req, res)=>{
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
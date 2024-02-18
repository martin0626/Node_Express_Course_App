const fs = require('fs');   
const { nextTick } = require('process');
const Tour = require('../models/tourModel');
const { match } = require('assert');


// exports.checkTours = (req, res, next) =>{
//     let newTour = req.body;

//     if(!newTour.name || !newTour.difficulty){
//         return res.status(400).json({
//             status: "Bad request",
//             message: "Invalid name or difficulty"
//         })
//     }
//     next();
// }


//Middleware to filter first five most rated Tours and sort them by price
exports.aliasTopTours = function(req, res, next){
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty'
    next()
}


exports.getAllTours = async(req, res)=>{
    try{
        //Build Query

        //1) Filtering
        let queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(f=>{delete queryObj[f]});
        
        //2) Advaced Filtering

        queryObj = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);


        const query = Tour.find(JSON.parse(queryObj));

        // 3) Sorting: ?sort=-duration,maxGroupSize  
        //First sort by duration then by maxGroupSize. With minus we order descending otherwise ascending
        if(req.query.sort){
            query.sort(req.query.sort.split(',').join(' '));
        }else{
            query.sort('-createdAt');
        }

        //4) Fields Limitation
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query.select(fields);
        }else{
            query.select('-__v');
        }


        //5) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query.skip(skip).limit(limit);

        if(req.query.page) {
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist!')
        }

        //Execute Query
        const tours = await query;

        res.status(200).json({
            status: "Success",
            count: tours.length,
            data: {
                tours
            }
        });
    }catch(err){
        res.status(404).json({
            status: "Fail",
            message:err
        });
    }
};




exports.getSingleTour = async (req, res)=>{
    try{
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "Success",
            data: {
                tour
            }
        }) 
    }catch(err){
        res.status(404).json({
            status: "Fail",
            message:err
        });
    }
};

exports.createTour = async (req, res)=>{
    try{
        const newTour = await Tour.create(req.body);
        res.status(200).json({
            status: "Success created",
            data: {
                newTour
            },
        }) 
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err,
        }) 
    }
    
};


exports.updateTour = async (req, res)=>{
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        })
        console.log(tour)
        res.status(200).json({
            status:"Success",
            data: {
                tour
            }
        })
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err,
        }) 
    }
};

exports.deleteTour = async (req, res)=>{
    try{
        const deletedTour = await Tour.findByIdAndDelete(req.params.id)
        
        res.status(204).json({
            status: "Success",
            results: null
        }) 
    }catch(err){
        res.status(400).json({
            status: "Fail",
            result: err
        })
    }
};
const fs = require('fs');   
const { nextTick } = require('process');
const Tour = require('../models/tourModel');
const { match } = require('assert');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('../utils/appError')
//Middleware to filter first five most rated Tours and sort them by price
exports.aliasTopTours = function(req, res, next){
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty'
    next()
}



exports.getAllTours = catchAsync(async(req, res, next)=>{
    //Build Query
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .fieldsLimitation()
        .pagination();
    
        
    //Execute Query
    const tours = await features.query;

    res.status(200).json({
        status: "Success",
        count: tours.length,
        data: {
            tours
        }
    });
});




exports.getSingleTour = catchAsync(async (req, res, next)=>{
    const tour = await Tour.findById(req.params.id);

    if(!tour) {
        next(new AppError(`Tour with this ID is not found!`, 404))
    }

    res.status(200).json({
        status: "Success",
        data: {
            tour
        }
    }) 
});




exports.createTour = catchAsync(async (req, res, next)=>{
    const newTour = await Tour.create(req.body);
    res.status(200).json({
        status: "Success created",
        data: {
            tour: newTour
        },
    }) 
        
});



exports.updateTour = catchAsync(async (req, res, next)=>{
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
});

exports.deleteTour = catchAsync(async (req, res, next)=>{
    const deletedTour = await Tour.findByIdAndDelete(req.params.id)
    
    res.status(204).json({
        status: "Success",
        results: null
    }) 
});

exports.getStats = catchAsync(async (req, res, next)=>{
    const stats = await Tour.aggregate([
        {
            $match: {ratingAverage: {$gte: 4.5} }
        },
        {
            $group: {
                _id: {$toUpper: '$difficulty' },
                numTours:{$sum: 1},
                numRatings:{$sum: "$ratingsQuantity"},
                avgRating:{$avg: '$ratingAverage'},
                avgPrice:{$avg: '$price'},
                maxPrice:{$max: '$price'},
                minPrice:{$min: '$price'}
            }
        },
        {
            $sort: { avgPrice: 1} 
        }
    ])

    res.status(200).json({
        status: "Success",
        results: stats
    }) 
})


exports.getMounthlyPlan = catchAsync(async (req, res, next) =>{
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            // Devide tours by single date. For each date in startDates, have separate tour.
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: {$month: '$startDates'},
                numTourStarts: {$sum: 1},
                tours: {$push: "$name"}
            }
        },
        {
            $sort: {numTourStarts: -1}
        },
        {
            $addFields: {month: "$_id"}
        }
    ])

    res.status(200).json({
        status: "Success",
        result: plan,
    });
    
})
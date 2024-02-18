const fs = require('fs');   
const { nextTick } = require('process');
const Tour = require('../models/tourModel');
const { match } = require('assert');
const APIFeatures = require('./../utils/apiFeatures')


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
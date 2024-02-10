const fs = require('fs');   
const { nextTick } = require('process');
const Tour = require('../models/tourModel');


exports.checkTours = (req, res, next) =>{
    let newTour = req.body;

    if(!newTour.name || !newTour.difficulty){
        return res.status(400).json({
            status: "Bad request",
            message: "Invalid name or difficulty"
        })
    }
    next();
}


exports.getAllTours = (req, res)=>{
    res.status(200).json({
        status: "Success",
    });
};

exports.getSingleTour = (req, res)=>{
    res.status(200).json({
        status: "Success",
        
    }) 
};

exports.createTour = async (req, res)=>{
    try{
        const newTour = await Tour.create(req.body);
        res.status(200).json({
            status: "Success created",
            message: newTour,
        }) 
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: "Invalid data send!",
        }) 
    }
    
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
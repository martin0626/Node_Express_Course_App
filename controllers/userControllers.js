const fs = require('fs');   
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { log } = require('console');

//'users.json' with all users
const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

const filterAllowedForUpdate = (obj, ...allowedFields)=>{
    const filteredObj = {};

    Object.keys(obj).forEach(k=>{
        if (allowedFields.includes(k)) filteredObj[k] = obj[k];
    })

    return filteredObj;
}

exports.getAllUsers = catchAsync( async (req, res, next)=>{

    const users = await User.find();

    res.status(200).json(
        {
            status: 'Success',
            results: users.length,
            body: {users},
        }
    )
});


exports.updateUser = catchAsync( async(req, res, next)=>{
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("Pssword can't be changed from here!", 400));
    }

    const filteredBody = filterAllowedForUpdate(req.body, 'name', 'email');
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });


    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
    });
});















exports.createUser = (req, res)=>{
    
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

exports.getSingleUser = (req, res)=>{
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


// exports.updateUser = (req, res)=>{
//     let params = req.params;
//     let user = users.filter((t)=>{return t._id == params.id})
    
//     user.length > 0 
//     ?
//     res.status(200).json({
//         status: "Success",
//         results: "Updated user Here",
//     }) 
//     :
//     res.status(404).json({
//         status: "Not found",
//         message: "Invalid ID",
//     })
// };


exports.deleteUser = (req, res)=>{
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
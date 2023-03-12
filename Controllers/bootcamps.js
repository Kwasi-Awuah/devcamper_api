//import {errorHandler} from '../utils/errorResponse';
const errorHandler = require('../utils/errorResponse')
const asyncHandler = require('express-async-handler')
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const { countDocuments } = require('../models/Bootcamp');


//desc     get all bootcamps 
//route     GET
//access     public 

exports.getBootcamps = asyncHandler(async (req , res , next) => {
    let query;

    //  Copy req.query 
    const reqQuery = {...req.query}

    // feilds to remove 
    const removeFields = ['select' , 'sort' , 'page','limit'];

    removeFields.forEach(param => delete reqQuery[param])

    console.log(reqQuery);

    // Create query String 
    let queryString = JSON.stringify(reqQuery)
    console.log(queryString);

    // ADVANCED FILTERING  and creating operators (gt ,gte , lt,etc )
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    console.log(queryString)
     
    // finding resource  
    query = Bootcamp.find(JSON.parse(queryString)).populate('course')

    //select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        console.log(fields) 
        query = query.select(fields)
    }

    // sort 
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        console.log(sortBy)
        query = query.sort(sortBy)    
    } else {
        query = query.sort('-createdAt') 
    }
    
    // pagination 
    const page = parseInt(req.query.page, 10 ) || 1
    const limit = parseInt(req.query.limit, 10) || 25  
    const startIndex = (page - 1)* limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()
     
    query = query.skip(startIndex).limit(limit)


    //getting all bootcamps  executing querry 
    const bootcamp = await query;

    const pagination = {}

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }

    if(startIndex > 0){
        pagination.previous = {
            page: page -1,
            limit,
        }
    }
    
    res.status(200).json({success : true ,count : bootcamp.length, pagination,  data : bootcamp})
})

// 2 desc     GETS SINGLE WITH A SPECIFIC BOOTCAMPS /api/v1/bootcamps/:id
//ROUTE      GET
//ACCESS     PUBLIC 
//res.status(201).json({success : true , msg:` SHOWING A SINGLE BOOTCAMP WITH THE ID  ${req.params.id}`})
exports.getBootcampsId = asyncHandler(async (req , res , next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404))
        }
        res.status(200).json({success : true , data : bootcamp})
      
    
})

//@ 3 desc     creates a new bootcamp = /api/v1/courses
//ROUTE      post
//ACCESS     private

exports.createBootcamps =asyncHandler(async (req , res , next) => {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
     success : true,
     data : bootcamp,
    })
});
//@ 4 desc     UPDATES BOOTCAMPS WITH A SPECIFIC /api/v1/bootcamps/:id
//ROUTE      PUT
//ACCESS     PUBLIC 
//res.status(201).json({success : true , msg:`UPDATING BOOTCAMP ${req.params.id  }`})
exports.updateBootcampsId = asyncHandler(async(req , res , next) => {
    
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id , req.body, {
        new : true,
        runValidators : true ,
    });

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404))
    }
    res.status(201).json({success: true , data: bootcamp})
   
})

//@ 5 desc     DELETES A BOOTCAMPS WITH A SPECIFIC  /api/v1/bootcamps/:id
//ROUTE      DELETE
//ACCESS     PRIVATE
//res.status(201).json({success : true , msg:`DELETING A BOOTCAMP WITH THE ID ${req.params.id}`})
exports.deleteBootcampsId = asyncHandler(async(req , res , next) => {
  
    const bootcamp = await Bootcamp.findById(req.params.id )

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404)) 
    }

    bootcamp.remove();
    
   // bootcamp.deleteOne();
    res.status(200).json({success : true , data :{}})
  
})

//@ 5 desc     GET A BOOTCAMPS WITHIN A SPECIFIC RADIUS   /api/v1/bootcamps/:zipcode/:distance
//ROUTE      GET
//ACCESS     PRIVATE
//res.status(201).json({success : true , msg:`DELETING A BOOTCAMP WITH THE ID ${req.params.id}`})
exports.getBootcampsInRaduis = asyncHandler(async(req , res , next) => {
    const {zipcode , distance} = req.params

    // GETTING LATITUDE ON LONGITUDE FROM GEOCODER

    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

        // CALCULATING THE RAIDUS  WITH RADIANS
        // DIVIDE THE DISTANCE BY THE RADUIS OF THE EARTH 
        //EARTH RADUIS = 3,963 mi / 6,378 km 
        
    const raduis = distance / 3963

    const bootcamps = await Bootcamp.find({
        location : {$geoWithin: {$centerSphere: [[lng , lat], raduis]}}
    })
    res.status(200).json({
        success : true ,
        data: bootcamps,
        count : bootcamps.length
    });   
})

// desc     upload photo for bootcamp
//ROUTE      put 
//ACCESS     PRIVATE

exports.bootcampPhotoUpload = asyncHandler(async(req , res , next) => {
  
    const bootcamp = await Bootcamp.findById(req.params.id )

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404)) 
    }

    if(!req.files) {
        return  next(new ErrorResponse(`Please upload a file ${req.params.id}`, 404) )
    }
  
})
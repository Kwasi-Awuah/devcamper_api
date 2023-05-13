const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler')
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


//desc     get all bootcamps 
//route     GET /api/v1/courses
//route     GET /api/v1/courses/bootcamps/:bootcampsId/courses
//access     public 
exports.getCourses = asyncHandler(async (req , res, next) => {
    let query ;

    if (req.params.bootcamp) {
      query =  Course.find({bootcamp: req.params.bootcamp})
    } else {
        query = Course.find().populate({
        path: 'bootcamp', 
        select: 'name description',
        options:{strictPopulate : false}}
    )}

    const courses = await query

    res.status(200).json({
        success : true,
        count : courses.length,
        data : courses
    })
})
//desc     get single course with a specific id  
//route     GET /api/v1/courses
//route     GET /api/v1/courses/:Id
//access     public 

exports.getCourse = asyncHandler (async (req ,res, next) => {
     const course = await Course.findById(req.params.id).populate({
        path:'bootcamp' , 
     })
    try {
        if(!course){
            return next(new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404))
        } 
    } catch (error) {
        console.log(`Course cannot be found${error}`, 404 )
    }

    res.status(200).json({
        success: true ,
        data : course,
    });
})


//@ 3 desc     creates a new course = /api/v1/courses
//ROUTE      post
//ACCESS     private

exports.createCourse =asyncHandler(async (req , res , next) => {
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
       return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.bootcampId}`, 404))
   }

    const course = await Course.create(req.body)

    res.status(201).json({
     success : true,
     data : course,
    })
});

//@ 3 desc     updates a course = /api/v1/courses/:id
//ROUTE      put 
//ACCESS     private

exports.updateCourse =asyncHandler(async (req , res , next) => {
    let course = await Course.findById(req.params.id);

    if(!course){
       return next(new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404))
   }

     course = await Course.findByIdAndUpdate(req.params.id,  req.body ,{
        new: true ,
        runValidators: true,
     })

    res.status(201).json({
     success : true,
     data : course,
    })
});

//@ 3 desc     delete a course = /api/v1/courses/:id
//ROUTE      delete
//ACCESS     private

exports.deleteCourse =asyncHandler(async (req , res , next) => {
    const course = await Course.findById(req.params.id);

    if(!course){
       return next(new ErrorResponse(`Course not deleted with the id of ${req.params.id}`, 404))
   }

    await Course.deleteOne()

    res.status(201).json({
     success : true,
     data : {}
    })
});

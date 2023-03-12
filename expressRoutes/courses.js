
const express = require('express');
const {
    getCourses, // all courses 
    getCourse, // a single course 
    createCourse,// create course
    updateCourse, // update course 
    deleteCourse // delete a course 
 
} = require('../Controllers/courses')

const router = express.Router({mergeParams: true});

router.route('/')
.get(getCourses)
.post(createCourse)

router.route('/:id')
.get(getCourse) // with a specific _id
.put(updateCourse)// update course with a specific _id 
.delete(deleteCourse)// deletes a course with a specific _id 





module.exports = router
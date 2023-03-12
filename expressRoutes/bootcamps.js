 
const { Router } = require('express');
const express = require('express');
const {
    getBootcamps,
    getBootcampsId,
    createBootcamps,
    updateBootcampsId,
    deleteBootcampsId,
    getBootcampsInRaduis,
    bootcampPhotoUpload,
} = require('../Controllers/bootcamps')

// include other resource routers
const courseRouter = require('./courses')

const router = express.Router();

// re-route imto other resource router 
router.use('/:bootcampId/courses' , courseRouter)

router.route('/raduis/:zipcode/:distance')
.get(getBootcampsInRaduis)

router.route('/')
.get(getBootcamps)
.post(createBootcamps)

router.route('/:id')
.get(getBootcampsId)
.put(updateBootcampsId)
.delete(deleteBootcampsId)

router.route('/:id/photo')
.put(bootcampPhotoUpload)





module.exports = router
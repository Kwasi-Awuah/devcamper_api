const mongoose = require('mongoose');
//const {Bootcamp} = require('./Bootcamp')

const courseSchema = new mongoose.Schema({
    title: {
        type: String, 
        trim : true ,
        required : [true, 'please add a course title ']
    },
    description: {
        type : String,
        required : [true,'please add a description to your course ']
    },
    weeks: {
        type : String ,
        required : [true , 'please add number of weeks']
    },
    tuition: {
        type : Number ,
        required : [true , 'please add a tuition cost'],
    },
    minimumSkill: {
        type : String ,
        required : [true , 'please add the minimum skills for this course'],
        enum:['beginner' , 'intermediate', 'advanced' ],
    },
    scholarhipsAvailable: {
        type : Boolean ,
        default: false
    },
    createdAt:{
        type :Date,
        default : Date.now
    },
    bootcamp : {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required : true ,
    }
})
// static method to get average course tuitions 
 courseSchema.statics.getAverageCost = async function(bootcampId){
    console.log("calculating average course......")

    const obj = await this.aggregate([
        {
            $match : {bootcamp :bootcampId}
        },
        {
            $group:{
                _id : '$bootcamp' ,
                averageCost: { $avg: '$tuition'  }
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId , {
            averageCost: Math.ceil(obj[0].averageCost / 10)*10
        })
    } catch (error) {
        
    }
}
 // call to getaverage cost after save 
courseSchema.post('save' , () => {
    this.constructor.getAverageCost(this.bootcamp)
})

 // call to getaverage cost after save 
courseSchema.pre('remove' , () => {
    this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course' , courseSchema);
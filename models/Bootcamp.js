const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder =require('../utils/geocoder')


const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true ,'please add name'],
        unique: true ,
        trim: true ,
        maxlength:[25 , 'name characters must only include 20 charcters']
    },
    slug: String,
    description:{
        type: String,
        required: [true ,'please add description'],
        maxlength:[500 , 'Description characters must only include 500  charcters'] 
    },
    website :{
        type: String,
        match:[
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 
            'please add a valid HTTP OR HTTPS '
        ],
    },
    phone: {
        type : String,
        maxlength:[20 , 'phone number must only include 20 charcters']
    },
    email :{
        type :String,
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please add an email'
        ],
    },
    address : {
        type : String,
        //required : [true, 'please add an adress']
    },
    location :{
        // Geo location 
        type: {
            type: String,
            enum: ['Point'],
            //required: true
          },
          coordinates: {
            type: [Number],
            //required: true,
            index : '2dsphere'
        },
         formattedAddress:String,
         street:String,
         city:String,
         state:String,
         zipcode:String,
         country:String,
    },
    careers :{
        type : [String],
        required : true ,
        enum :[
            'Web Development',
            'UI/UX',
            'Mobile Development',
            'Data Science',
            'Business',
            'Other',
        ]
    },
    averageRating: {
        type : Number,
        min : [1 , 'the minimum must be at least one'],
        max : [10 , 'the maximum cannot be more than ten']
    },
    averageCost: Number,
    photo :{
        type : String,
        default : 'no-photo.jpeg'
    },
    housing : {
        type : Boolean,
        default: false,
    },
    jobAssitance : {
        type : Boolean,
        default : false,
    },
    jobGuarantee : {
        type : Boolean,
        default: false,
    },
    acceptGi : {
        type : Boolean,
        default : false,
    },
    createdAt : {
        type : Date,
        default : Date.now
    },

  // virtuals
}, { toJSON: { virtuals: true }},
   { toObject: { virtuals: true }}
)  

// Create bootcamp from the name 

BootcampSchema.pre('save' ,  function (next) {
    this.slug = slugify(this.name , {lower :  true})
    next();
});

// Geocode and create location field
BootcampSchema.pre('save' , async function (next) {
    const loc = await  geocoder.geocode(this.address)
    this.location = {
        type : 'Point',
        coordinates : [loc[0].longitude , loc[0].latitude ],
        formattedAddress : loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,

         
    };
    // do not save address in DB
    this.address = undefined;

    next();
});
//Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next){
    console.log(`Course is is been remove from bootcamp${this._id}`)
    await this.model('Course').deleteMany({bootcamp: this._id})
    next() 
})

// Reverse populate with virtuals  
BootcampSchema.virtual('course', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false 
});
module.exports = mongoose.model('Bootcamp' , BootcampSchema)  
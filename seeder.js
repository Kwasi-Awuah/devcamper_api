const fs = require('fs');
const mongoose = require('mongoose');
const  colors = require('colors');
const dotenv = require('dotenv');

//LOAD ALL ENV VARS

dotenv.config({path: './config/config.env'})

// LOAD MODELS  
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

// CONECT TO DB
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI , {
    //useNewUrlParser : true,
    //useCreateIndex: true ,
   // useFindAndModify: false,
    //useUndefinedTopology:true,
})

//READ JSON 

const bootcamp = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
   fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);


// A FUNCTION  THAT IMPORTS THE DATA INTO OUR DATABASE 
const importData = async () => {
    try {
       await Bootcamp.create(bootcamp) 
       await Course.create(courses ) 
       console.log('data has been imported to the database'.green.inverse);
       process.exit();
    } catch (err) {
         console.error(err)
    }
}

// DELETE IMPORTED DATA 

const deletetData = async () => {
    try {
    //    await Bootcamp.deleteMany({ bootcamps :
	// 	{"_id":String,
	// 	"user": String,
	// 	"name": String,
	// 	"description": String,
	// 	"website": String,
	// 	"phone": String,
	// 	"email": String,
	// 	"address": String,
	// 	"careers": String,
	// 	"housing": true,
	// 	"jobAssistance": true,
	// 	"jobGuarantee": false,
	// 	"acceptGi": true,
    //     "averageCost":Number,
    // }}) 
    await Bootcamp.deleteMany()
    await Course.deleteMany()
       console.log('data has been deleted from the database'.red.inverse)
       process.exit();
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deletetData();
}; 
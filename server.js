const express = require('express');
const dotenv = require('dotenv');
const fileupload = require("express-fileupload")
//middleware
const morgan = require('morgan');
const connectDB = require('./config/db')
const colors = require('colors');
const errorHandler = require('./Middleware/error')
//Load env files (vars)
dotenv.config({ path: './config/config.env' });

connectDB()

// Route files 
const bootcamps = require('./expressRoutes/bootcamps')
const courses = require('./expressRoutes/courses')

const app  = express();
//Body parser
app.use(express.json())

// dev loggiing middleware 
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

//file upload middleware 

app.use(fileupload())
// Mount routers
app.use('/api/v1/bootcamps' , bootcamps)

app.use('/api/v1/courses', courses)


//error midleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT ,() => {
    console.log(`Server is runing in ${process.env.NODE_ENV} mode on port ${PORT}`.bgMagenta.bold)
}) 


// handle unhandled rejection 

process.on('unhandledRejection' , (err , promise) => {
    console.log(`Error: ${err.message}`. red)
    // close server 
    server.close(() => process.exit(1))
})



















// const express = require('express');
// const app = express();

// app.get('/' , (req ,res) => {
//     res.send('okay !')
// })

// app.listen(5002 , () => {
//     console.log("Server is runing")
// })
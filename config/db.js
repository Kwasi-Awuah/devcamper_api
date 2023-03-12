
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGO_URI , {
        //useNewUrlParser : true,
        //useCreateIndex: true ,
       // useFindAndModify: false,
        //useUndefinedTopology:true,
    })
    console.log(`Mongo DB is connected ${connect.connection.host}`.blue.bold)
}
module.exports = connectDB;
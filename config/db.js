const mongoose = require('mongoose');

const connectDB = async function() {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log(`MongoDB Connected: ${con.connection.host}`);
    } catch (error) {
        console.error(err);
        process.exit(1);
    }
}
module.exports = connectDB;
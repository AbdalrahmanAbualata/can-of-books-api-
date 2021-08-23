  
const mongoose = require("mongoose");


const BookSchema = new mongoose.Schema({
    title: String,
    description:String,
    status:String,
    email:String,
});
module.exports = BookSchema ;
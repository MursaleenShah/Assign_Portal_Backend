const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:String,
    password : String,
    //added
    role: { type: String, enum: ["admin", "student"], required: true }
});
module.exports = userSchema;
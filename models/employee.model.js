const mongoose = require('mongoose');
// mongoose.set('useFindAndModify', false);
const employeeschema = mongoose.Schema({
    username: { type: String, required: [true, 'username is required'] },
    password: { type: String, required: true },
    mail: { type: String, unique: true },
    profileimage: { type: String },
    gender: String,
    mobile: { type: Number, unique: true },
    hometown: String,
    interests: [String],
    experience: Number,
    maritalStatus: String,
    nationality: String,
    languages: [String],
    currentLocation: String,
    lastjobexp: Number,
    lastjobDesig: String,
    department: String,
    appliedjobs: [String],
    reasonsforleaving: String,
    loggeddate: { type: Date, default: Date.now() }
});
const employeemodel = mongoose.model('jobseekers', employeeschema);
module.exports = employeemodel;
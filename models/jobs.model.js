const mongoose=require('mongoose');
 const jobsschema=mongoose.Schema({
     jobRole:String,
     companyId:String,
     expRequired:String,
     skills:[String],
     educationalQualifications:String,
     jobDescription:String,
     jobType:String,
     postedDate:{type:Date,default:Date.now()}

 });

 const jobsmodel=mongoose.model('jobs',jobsschema);
 module.exports=jobsmodel;
const recruitmodel = require('../models/recruiter.model');
class Recruiter {
    getRecruiters() {
        return recruitmodel.find().exec();
    }
    checkRecruiter(companyname) {
        return recruitmodel.findOne({ companyName: companyname }).exec();
    }
    addRecruiter(data) {
        let recruiter = new recruitmodel(data);
        recruiter.save();
    }
    searchRecruiter(companyname) {
        return recruitmodel.findOne({ companyName: companyname }, { companyId: 1, companyName: 1 }).exec();
    }
    loginrecruiters(companyname) {
        return recruitmodel.findOne({ companyName: companyname }).exec();
    }
    updateRecruiter(id, data) {
        return recruitmodel.findByIdAndUpdate(id, { $set: data }).exec();
    }
    getRecruiterName(id) {
        return recruitmodel.findOne({ _id: id }, { companyName: 1, _id: 0 }).exec();
    }
    getRecruiterID(id) {
        return recruitmodel.findOne({ _id: id }).exec();
    }
    getSeekersList(id) {
        return recruitmodel.findOne({ _id: id }, { appliedPeople: 1, _id: 0 }).exec();
    }
}

module.exports = new Recruiter();
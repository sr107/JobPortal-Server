const jobsmodel = require('../models/jobs.model');
class JobService {

    postajob(data) {
        let newjob = new jobsmodel(data);
        newjob.save();
    }
    getalljobs() {
        return jobsmodel.find().exec();
    }
    getjobsByCompany(companyid) {
        return jobsmodel.find({ companyId: companyid }, { expRequired: 1, jobType: 1, jobRole: 1, postedDate: 1, _id: 0 }).exec();
    }
    sortjobsByDate() {
        return jobsmodel.find().sort({postedDate:-1}).exec();
    }
    jobCompanyAndRoleCheck(companyid, jobrole) {
        return jobsmodel.findOne({ companyId: companyid, jobRole: jobrole }).exec();
    }
    getjobsbyroles(role) {
        return jobsmodel.find({ jobRole: role }, { educationalQualifications: 0, jobDescription: 0, _id: 0, __v: 0 }).exec();
    }
    getjobbyid(id) {
        return jobsmodel.findOne({ _id: id }, { companyId: 1, jobRole: 1,expRequired:1,jobType:1 }).exec();
    }

}

module.exports = new JobService();
const emplyeemodel = require('../models/employee.model');
class Employee {
    getallEmployess() {
        return emplyeemodel.find().exec();
    }
    getprofile(id) {
        return emplyeemodel.findById(id, {loggeddate: 0 }).exec();
    }
    employeecheck(mail, mobile) {
        return emplyeemodel.find({ $or: [{ mail: mail }, { mobile: mobile }] }).exec();
    }
    addEmployee(data) {
        let employee = new emplyeemodel(data);
        return employee.save();
    }
    getEmployeelogin(username) {
        return emplyeemodel.findOne({ username: username }).exec();
    }
    updateEmployee(id, data) {
        return emplyeemodel.findOneAndUpdate(id,{ $set: data}).exec();
    }
    getemployeeByID(id) {
        return emplyeemodel.findById(id).exec();
    }
    getAppliedList(name) {
        return emplyeemodel.findOne({ username: name }, { appliedjobs: 1 }).exec();
    }
    profileForRecruiter(id) {
        return emplyeemodel.findById(id, { username: 1, mail: 1, mobile: 1, currentLocation: 1, gender: 1,interests:1 }).exec();
    }


}
module.exports = new Employee();
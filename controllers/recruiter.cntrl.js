const recruitersvc = require('../services/recruiter.svc');
const jobssvc = require('../services/jobs.svc');
const employeesvc = require('../services/emplyee.svc');
const bcrypt = require('bcryptjs');
const recruitercntrl = {
    getrecruiters: async function (req, res) {
        try {
            let recruiters = await recruitersvc.getRecruiters();
            res.json(recruiters).status(200);
        } catch (error) {
            res.send(error).status(200);
        }
    },
    addrecruiters: async function (req, res) {
        try {
            let recruiterpresent = await recruitersvc.checkRecruiter(req.body.companyName);
            if (recruiterpresent) {
                res.send("Added already").status(200);
            } else {
                req.body.password = bcrypt.hashSync(req.body.password, 2);
                await recruitersvc.addRecruiter(req.body);
                res.send("Added Succesfully").status(200);
            }
        } catch (error) {
            res.send(error).status(200);
        }
    },
    searchrecruiter: async function (req, res) {
        try {
            let companyname = req.params.companyname;
            let searchedcompany = await recruitersvc.searchRecruiter(companyname);
            if (searchedcompany) {
                res.json(searchedcompany).status(200);
            } else {
                res.send("Become a recruiter to see your name").status(200);
            }
        } catch (error) {
            res.send(error).status(200);
        }
    },
    loginrecruiter: async function (req, res) {
        try {
            let user = await recruitersvc.loginrecruiters(req.body.companyName);
            let login = bcrypt.compareSync(req.body.password, user.password);
            if (login) {
                res.send("Oh Your logged in!!!").status(200);
            }
            else {
                res.send("I think Your are drowsy.try Again With mind!!! ").status(200);
            }

        } catch (error) {
            res.send(error).status(200);
        }
    },
    getjobsofrecruiter: async function (req, res) {
        try {
            let id = req.params.id;
            let jobsbyname = await jobssvc.getjobsByCompany(id);
            let jobscount = jobsbyname.length;
            if (jobscount > 0) {
                res.json({ "No-of-Jobs": jobscount, "jobs": jobsbyname })
                // res.json(jobsbyname).status
            } else {
                res.send("You Haven't Posted any Job Yet");
                tes.status(200);
            }
        } catch (error) {
            res.send(error).status(200);
        }
    },
    addnewjob: async function (req, res) {
        try {
            let roleexist = await jobssvc.jobCompanyAndRoleCheck(req.body.companyId, req.body.jobRole);
            if (!roleexist) {
                await jobssvc.postajob(req.body);
                res.send("Your Jobs is Live.Lets Wait for the seekers!!!").status(200);
            }
            else {
                res.send("A position with same role already exists,Post Role using another Name");
                res.status(200);
            }

        } catch (error) {
            res.send(error).status(200);
        }
    },
    editprofile: async function (req, res) {
        try {
            let id = req.body._id;
            if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 2);
            let updated = await recruitersvc.updateRecruiter(id, req.body);
            if (updated) {
                res.send("Updated Your Info!!!!!!!!").status(200);
            }
            else {
                res.send("Somthing is wrong").status(200);
            }

        } catch (error) {
            res.send("Internal Server error").status(500);

        }
    },
    seekerslist: async function (req, res) {
        try {
            let id = req.params.id;
            let seekers = await recruitersvc.getSeekersList(id);
            let employeelist = seekers.appliedPeople;
            let employeearray = [];
            for (let i = 0; i < employeelist.length; i++) {
                let employeedetails = await employeesvc.profileForRecruiter(employeelist[i]);
                employeearray.push(employeedetails);
            }
            res.send(employeearray);
            res.status(200);
        } catch (error) {
            res.send("Internal Servrer Error");
            res.status(500);
        }
    },
    uploadprofilepicture: async function (req, res) {
        try {
            let id = req.params.id;
            let uploadedimage = await recruitersvc.updateRecruiter(id, req.body);
            if (uploadedimage) {
                res.send("Profile Picture Uploaded Successfully!!");
                res.status(200);
            }
        } catch (error) {
            res.send("Internal Server error");
            res.status(500);
        }
    }

}
module.exports = recruitercntrl;
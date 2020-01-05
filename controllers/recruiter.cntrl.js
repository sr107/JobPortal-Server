const recruitersvc = require('../services/recruiter.svc');
const jobssvc = require('../services/jobs.svc');
const employeesvc = require('../services/emplyee.svc');
const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken');
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
                res.send({ status: 0, message: "You are already a job Giver" }).status(200);
            } else {
                req.body.password = bcrypt.hashSync(req.body.password, 2);
                await recruitersvc.addRecruiter(req.body);
                res.send({ status: 1, message: "Congratulations your now a job Giver" }).status(200);
            }
        } catch (error) {
            res.send('Internal Server Error').status(200);
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
            let token = jwt.sign({
                companyName: req.body.companyName, id: user._id
            }, config.secret, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) });
            if (login) {
                res.status(200).json({ status: 1, data: { companyName: req.body.companyName, token: token } });
            }
            else {
                res.status(200).send({ status: 0, data: { message: 'Invalid username/password' } });
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
                res.json({status:1,data:jobsbyname}).status(200);
                // res.json(jobsbyname).status
            } else {
                res.json({status:0,message:"You Haven't Posted any Job Yet"});
                res.status(200);
            }
        } catch(error) {
            res.send(error).status(200);
        }
    },
    addnewjob: async function (req, res) {
        try {
            let roleexist = await jobssvc.jobCompanyAndRoleCheck(req.body.companyId, req.body.jobRole);
            if (!roleexist) {
                await jobssvc.postajob(req.body);
                res.send({status:1,message:"Your Jobs is Live.Lets Wait for the seekers!!!"}).status(200);
            }
            else {
                res.send({status:0,message:"A position with same role already exists,Post Role using another Name"});
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
            if(employeelist.length>0)
            {
                let employeearray = [];
            for (let i = 0; i < employeelist.length; i++) {
                
                let employeedetails = await employeesvc.profileForRecruiter(employeelist[i].emp_id);
                let appliedroleis=employeelist[i].jobrole;
                employeearray.push({"details":employeedetails,"appliedfor":appliedroleis});
            }
            res.send({status:1,employeearray});
            res.status(200);
            }
            else{
                res.send({status:0,message:"NO One Has Applied till,let Wait"});
            }
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
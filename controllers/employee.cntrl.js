const employeesvc = require('../services/emplyee.svc');
const bcrypt = require('bcryptjs');
const jobssvc = require('../services/jobs.svc');
const recruitersvc = require('../services/recruiter.svc');
const jwt = require('jsonwebtoken');
const config = require('../config');
const employeecntrl = {
    getemployess: async function (req, res) {
        try {
            let allemployess = await employeesvc.getallEmployess();
            let employess = allemployess;
            for (let i = 0; i < employess.length; i++) {
                if (employess[i].profileimage) {
                    employess[i].profileimage = `${req.protocol}://${req.get('host')}/${employess[i].profileimage}`;

                }
                else {
                    employess[i].profileimage = '';
                }
            }
            res.json(allemployess).status(200);
        } catch (error) {
            res.send(error).status(200);
        }

    },
    addemployees: async function (req, res) {
        try {
            let mail = req.body.mail;
            let mobile = req.body.mobile;
            let employeepresent = await employeesvc.employeecheck(mail, mobile);
            if (employeepresent.length >= 1) {
                res.send({ status: 0, message: "You are already a job seeker" }).status(200);
            }
            else {
                req.body.password = bcrypt.hashSync(req.body.password, 2);
                let result = await employeesvc.addEmployee(req.body);
                if (result) {
                    res.send({ status: 1, message: "Congratulations your now a job seeker" }).status(200);
                }

            }
        } catch (error) {
            if (error && error.errmsg && error.errmsg.includes('duplicate key error collection') > -1) {
                res.status(200).send({ status: 0, data: 'Already exist' });
            } else {
                res.status(500).send('Internal server error');
            }
        }
    },
    employeelogin: async function (req, res) {
        try {
            let employee = await employeesvc.getEmployeelogin(req.body.username);
            let login = bcrypt.compareSync(req.body.password, employee.password);
            let token = jwt.sign({
                username: req.body.username, id: employee._id
            }, config.secret, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) });
            if (login) {
                //console.log(token);
                res.status(200).json({ status: 1, data: { username: req.body.username, token: token } });
            }
            else {
                res.status(200).send({ status: 0, data: { message: 'Invalid username/password' } });
            }
        } catch (error) {
            res.send(error).status(200);
        }
    },
    editprofile: async function (req, res) {
        try {
            let id = req.body._id;
            //console.log(req.body.username);
            if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 2);
            let updated = await employeesvc.updateEmployee(id, req.body);
            //console.log(updated);
            //console.log("gg");
            if (updated) {
                res.json("Updated Your Info!!!!!!!!").status(200);
            }
            else {
                res.json("Somthing is wrong").status(200);
            }

        } catch (error) {
            res.send("Internal Server error").status(500);

        }
    },
    getjobsforseekers: async function (req, res) {
        try {
            let id = req.params.id;
            let employee = await employeesvc.getemployeeByID(id);
            //console.log(employee);
            let username = employee.username;
            let alljobs = await jobssvc.getalljobs();
            let applied = await employeesvc.getAppliedList(username);
            let response = applied.appliedjobs;
            // console.log(response);
            let temparray = [];
            for (let i = 0; i < alljobs.length; i++) {
                let companyid = alljobs[i].companyId;
                // console.log(alljobs[i]._id);
                let companyname = await recruitersvc.getRecruiterName(companyid);
                temparray.push({ "companyName": companyname.companyName, "jobDetails": alljobs[i] });
            }
            for (let i = 0; i < temparray.length; i++) {
                for (let j = 0; j < response.length; j++) {
                    if (temparray[i].jobDetails._id == response[j]) {
                        temparray.splice(i, 1);
                        //console.log(temparray.length);
                        continue;
                    }
                }
            }
            // console.log(temparray.length);
            res.send(temparray);
            res.status(200);
        } catch (error) {
            res.send("Internal Error").status(500);
        }
    },
    getprofileofseeker: async function (req, res) {
        try {
            let id = req.params.id;
            let profile = await employeesvc.getprofile(id);
            // if(profile.password)
            // {
            //     profile.password=bcrypt.encodeBase64(profile.password);
            // }
            if (profile.profileimage) {
                profile.profileimage = `${req.protocol}://${req.get('host')}/${profile.profileimage}`;
            }
            res.send(profile).status(200);
        } catch (error) {
            res.send("Internal Error").status(500);
        }
    },
    getjobsbyrole: async function (req, res) {
        try {
            let role = req.params.role;
            let jobsrolearray = await jobssvc.getjobsbyroles(role);
            let temparray = [];
            if (jobsrolearray.length >= 1) {
                for (let i = 0; i < jobsrolearray.length; i++) {
                    let companyname = await recruitersvc.getRecruiterName(jobsrolearray[i].companyId);
                    temparray.push({ "companyName": companyname.companyName, "JobDetails": jobsrolearray[i] });
                }
                res.json(temparray).status(200);
            } else {
                res.json(temparray).status(200);
            }
        } catch (error) {
            res.send(error).status(200);
        }
    },
    getlatestjobs: async function (req, res) {
        try {
            let latestjobs = await jobssvc.sortjobsByDate();
            let temparray = [];
            //console.log(latestjobs[3]);
            // console.log(latestjobs.length);
            for (let i = 0; i < latestjobs.length; i++) {
                let companyid = latestjobs[i].companyId;
                let companyname = await recruitersvc.getRecruiterName(companyid);

                temparray.push({ "companyName": companyname.companyName, "jobDetails": latestjobs[i] });
                //temparray.save();
            }
            // console.log(temparray);
            res.send(temparray);
            res.status(200);
        } catch (error) {
            res.send("Internal Error").status(500);
        }
    },
    getjobsbycompanyname: async function (req, res) {
        try {
            let name = req.params.name;
            let jobsbynamearray = await recruitersvc.searchRecruiter(name);
            //console.log(jobsbynamearray);
            let companyid = jobsbynamearray._id;
            let companyname = jobsbynamearray.companyName;
            let temparray = [];
            let jobslist = await jobssvc.getjobsByCompany(companyid);
            // console.log(jobslist);
            let totaljobscount = jobslist.length;
            //console.log(totaljobscount);
            if (totaljobscount >= 1) {
                //temparray.push({"jobs": jobslist} );
                res.json({status:1,jobs:jobslist}).status(200);
            }
            else {
                res.send({status:0,message:"No Jobs Posted for this Company"});
                res.status(200);
            }
        } catch (error) {
            res.send(error).status(200);
        }
    },
    applyforjob: async function (req, res) {
        try {
            let jobid = req.params.jobid;
            let alreadyapplied = false;
            let employee_id = req.params.employee_id;
            let jobdetails = await jobssvc.getjobbyid(jobid);
            if (jobdetails) {
                let companyid = await recruitersvc.getRecruiterID(jobdetails.companyId);
                let employeeid = await employeesvc.getemployeeByID(employee_id);
                for (let i = 0; i < employeeid.appliedjobs.length; i++) {
                    if (employeeid.appliedjobs[i] === jobid) {
                        alreadyapplied = true;
                    } else {
                        alreadyapplied = false;
                    }
                }
                if (!alreadyapplied) {
                    companyid.appliedPeople.push({ "emp_id": employee_id, "jobrole": jobdetails.jobRole });
                    companyid.save();
                    // companyid.fulldetails=[{"emp_id":employee_id,"job_":jobdetails.jobRole}];
                    //console.log(companyid.appliedPeople);
                    employeeid.appliedjobs.push(jobid);
                    employeeid.save();
                    res.send({ status: 1, message: "Succesfully applied for the job,Wait for recruiters Action!!!!" }).status(200);
                }
                else {
                    res.send({ status: 0, message: "You have applied to this Job already" });
                    res.status(200);
                }
            }
        } catch (error) {
            res.send({ message: "Internal Server Error" }).status(500);
        }
    },
    appliedJobsOfEmployee: async function (req, res) {
        try {
            let name = req.params.name;
            let appliedlist = await employeesvc.getAppliedList(name);
            const temparray = [];
            let response = appliedlist.appliedjobs;
            let appliedjobslength = response.length;
            // console.log(appliedjobslength);

            if (appliedjobslength > 0) {
                for (let i = 0; i < appliedjobslength; i++) {
                    // console.log(i);
                    let jobslist = await jobssvc.getjobbyid(response[i]);
                    let companyname = await recruitersvc.getRecruiterName(jobslist.companyId);
                    //console.log(companyname.companyName);
                    temparray.push({ "companyName": companyname.companyName, "jobsdetails": jobslist });
                }
                res.send(temparray);
                res.status(200);
            }
            else {
                res.send({ status: 1, message: "Not applied Yet!!!" });
                res.status(200);
            }

        } catch (error) {
            res.send("Internal Server Errro");
            res.status(200);

        }
    },
    uploadprofilepicture: async function (req, res) {
        try {
            let id = req.params.id;
            let uploadedimage = await employeesvc.updateEmployee(id, req.body);
            // console.log(req.body);
            if (uploadedimage) {
                res.json("Profile Picture Uploaded Successfully!!");
                res.status(200);
            }
        } catch (error) {
            res.send("Internal Server error");
            res.status(500);
        }
    }
}
module.exports = employeecntrl;
const jobssvc = require('../services/jobs.svc');
const jobscntrl = {
    postnewjob: async function (req, res) {
        try {
            let cName = req.body.companyName;
            let jrole = req.body.jobRole;
            let oldjob = await jobssvc.jobCompanyAndRoleCheck(cName, jrole);
            if (oldjob) {
                res.send("I think You Posted one already for the same role").status(200);
            }
            else {
                await jobssvc.postajob(req.body);
                res.send("Your Job is Live").status(200);
            }

        } catch (error) {
            res.send("internal Error").status(500);
        }
    },
    getjobs: async function (req, res) {
        try {
            let alljobs = await jobssvc.getalljobs();
            if (alljobs) {
                res.json(alljobs).status(200);
            } else {
                res.send("Somthing is wrong boy try again").status(200);
            }
        } catch (error) {
            res.send("Internal Server Error").status(500);
        }
    },
    getjobsbyname: async function (req, res) {
        try {
            let name = req.params.name;
            let jobsbyname = await jobssvc.getjobsByCompany(name);
            res.send(jobsbyname).status(200);
        } catch (error) {
            res.send(error).status(500);
        }
    },
    getjobsBydate: async function (req, res) {
        try {
            let sortedjobs = await jobssvc.sortjobsByDate();
            //console.log(sortedjobs);
            res.send(sortedjobs).status(200);
        } catch (error) {
            res.send(error).status(500);
        }
    }
}
module.exports = jobscntrl;
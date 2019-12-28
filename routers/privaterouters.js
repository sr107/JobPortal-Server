const express = require('express');
const router = express.Router();
const multer = require('multer');
const employeecntrl = require('../controllers/employee.cntrl');
const recruitercntrl = require('../controllers/recruiter.cntrl');
const middleware = require('../middlewares/middle');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let filename = Date.now() + '-' + file.originalname;
    req.body.profileimage = filename;
    cb(null, filename)
  }
});
const upload = multer({ storage: storage });



//EMPLOYEE ROUTERS 

router.get('/employees', employeecntrl.getemployess);
router.get('/employees/profile/:id', employeecntrl.getprofileofseeker);
router.post('/employee/uploadpicture/:id',upload.single('profileimage'),employeecntrl.uploadprofilepicture);
router.get('/employees/jobrole/:role', employeecntrl.getjobsbyrole);
router.get('/employees/companyname/:name', employeecntrl.getjobsbycompanyname);
router.get('/employees/latest', employeecntrl.getlatestjobs);
router.get('/employees/apply/:employee_id/:jobid', employeecntrl.applyforjob);
router.get('/employees/appliedlist/:name', employeecntrl.appliedJobsOfEmployee);
router.put('/employees/editprofile',employeecntrl.editprofile);

//RECRUITER ROUTES

router.post('/recruiter/uploadpicture/:id',upload.single('profileimage'),recruitercntrl.uploadprofilepicture);
router.put('/recruiters/editprofile',recruitercntrl.editprofile);
router.get('/employees/getjobs/:id', employeecntrl.getjobsforseekers);
router.get('/recruiters', recruitercntrl.getrecruiters);
router.get('/recruiters/seekers/:id', recruitercntrl.seekerslist);
router.get('/recruiters/jobs/:id', recruitercntrl.getjobsofrecruiter);
router.get('/recruiters/:companyname', recruitercntrl.searchrecruiter);
router.post('/recruiters/addjob', recruitercntrl.addnewjob);
module.exports = router;
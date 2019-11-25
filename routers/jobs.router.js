const express=require('express');
const router=express.Router();
const jobscntrl=require('../controllers/jobs.cntrl');
router.post('/postjob',jobscntrl.postnewjob);
router.get('/getjobs',jobscntrl.getjobs);
router.get('/jobsdate',jobscntrl.getjobsBydate);
router.get('/getjobs/:name',jobscntrl.getjobsbyname);
module.exports=router;

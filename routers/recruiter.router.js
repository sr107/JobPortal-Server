const express=require('express');
const router=express.Router();
const multer  = require('multer');
const recruitercntrl=require('../controllers/recruiter.cntrl');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    }, 
    filename: function(req, file, cb){
        let filename = Date.now() + '-' + file.originalname;
        req.body.profileimage = filename;
        cb(null, filename)
    }
});
const upload = multer({storage: storage});
router.get('/recruiters',recruitercntrl.getrecruiters);
router.post('/addrecruiter',upload.single('profileimage'),recruitercntrl.addrecruiters);
router.get('/recruiters/:companyname',recruitercntrl.searchrecruiter);
router.post('/login',recruitercntrl.loginrecruiter);

module.exports=router;
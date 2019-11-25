const express = require('express');
const router = express.Router();
const multer = require('multer');
const employeecntrl = require('../controllers/employee.cntrl');

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
router.get('/employees', employeecntrl.getemployess);
router.post('/addemployee', upload.single('profileimage'), employeecntrl.addemployees);
router.post('/employee/login', employeecntrl.employeelogin);
module.exports = router;
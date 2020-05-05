const express=require('express');
const defaultcntrl= require('../controllers/default.cntrl')
const router=express.Router();

router.get('/',defaultcntrl.default);
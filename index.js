var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const trueLog = require('true-log');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const mongoose = require('mongoose');
const publicrouter = require('./routers/publicrouters');
const privaterouter = require('./routers/privaterouters');
const jobsrouter = require('./routers/jobs.router');
const authorization = require('./middlewares/middle');
app.use(express.static('uploads/'));
app.use(bodyParser.json());
const ws = fs.createWriteStream(path.join(__dirname, "log.txt"), { flags: 'a' });
app.use(trueLog({ level: 'full', stream: ws }));
app.use('/public', publicrouter);
//app.use(authorization.jwtAuth);
app.use('/private', privaterouter);
app.use('/jobs', jobsrouter);


mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (error, res) => {
    if (res) {
        console.log('DB1 Connected successfully');
    }
    else {
        console.log("Something error occured");
    }
});

// const arraylog=[];
// var input=null;
// const reader=readline.createInterface({input:
//     fs.createReadStream(__dirname+'/log.txt')});
// reader.on('line',line =>{
//     arraylog.push(JSON.parse(line));
// });
// reader.on('close',d=>{
//     arraylog.push(e=>console.log(e.action));
// })
// fs.readFile('log.txt', function(err, buf) {
//     const a = buf.toString();
//     let serachers=0;
//     const arraylog=[];
//     const b = a.split('}');
//     for(let i = 0; i < b.length; i++){
//         // if(b[i].url===""/public/addrecruiter"")
//         // {
//         //     serachers++;
//         // }
//         arraylog.push(JSON.parse(b[i]));
//     }
//     console.log(arraylog);
// })
// console.log(arraylog);

app.listen(3000, function () {
    console.log('Server runing on 3000 port');
})
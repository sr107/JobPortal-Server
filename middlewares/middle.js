const jwt = require('jsonwebtoken');
const config = require('../config');
const employeesvc = require('../services/emplyee.svc');
let basicAuthorization = {
    basicAuth: function (req, res, next) {
        try {
            if (req.headers['authorization']) {
                const credentials = req.headers['authorization'].replace("Basic", "");
                let decodedString = new Buffer(credentials, 'base64').toString();
                decodedString = decodedString.split(':');
                if (decodedString[0] === 'admin' && decodedString[1] === 'admin123') {
                    next();
                } else {
                    res.status(401);
                    res.send('Unauthorized User');
                }
            } else {
                res.status(400);
                res.send('Bad Request');
            }
        } catch (error) {
            res.status(500);
            res.send('Internal server error');
        }
    },
    jwtAuth(req, res, next) {
        try {
            if (req.headers['authorization']) {
                const credentials = req.headers['authorization'];
                jwt.verify(credentials, config.secret, function (err, decoded) {
                    if (err) {
                        res.status(401);
                        res.send('Unauthorized User');
                    } else {
                        // res.header('Access-Control-Allow-Credentials',true)
                        // res.header("Access-Control-Allow-Origin", "*");
                        // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                        next();
                    }
                })
            } else {
                res.status(400);
                res.send('Bad Request');
            }
        } catch (error) {
            res.status(500);
            res.send('Internal server error');
        }
    },
    searchemployee: async function (req, res, next) {
        try {
            let mobile = req.body.mobile;
            let mail = req.body.mail;
            let haspresence = await employeesvc.employeecheck(mail, mobile);
            console.log(haspresence.length);
            if (haspresence.length > 0) {
                console.log("Sorry");
            }
            else {
                next();
            }

        } catch (error) {
            res.send(error).status(200);
        }
    }
}
module.exports = basicAuthorization;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const otp = require('./twilio');
const app = express();
const mongoose = require("mongoose");
require("./models/registerModel");

app.use(cors());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const registerUser = mongoose.model('registeredUser');

mongoose.connect('mongodb+srv://admin:allah786@cluster0.m3d4x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("mongodb connection successfull");
})
mongoose.connection.on("error", () => {
    console.log("mongodb connection error");
})


app.post('/register', (req, res) => {
    const regData = {
        firstName: req.body.fName, 
        lastName: req.body.lName, 
        phone: `+92${req.body.phone}`,
        gender: req.body.gender,
        email: req.body.email,
        otpStatus: false,
        password: req.body.password
    }
    const user = new registerUser(regData);
    user.save()
    .then(() => {
        res.json({"status": 'true'});
    })
    .catch(() => {
        res.json({"status": 'false'});
    });
    // console.log(regData);
    // res.send("success")

    // sending otp code
    // const welcomeMessage = 'Welcome to Chillz! Your verification code is 54875';
    
})

app.post('/getotp', (req, res) => {
    otp.sendOtp(`+92${req.body.phone}`);
    // if(otpres){
        res.status(200).send({
            "otp": "send"
        })
    // }else{
        // res.status(503).send({
        //     "message": "Service Unavailable"
        // })
    // }
})

app.post('/verify', (req, res) => {
    const obj = {
        phone: req.body.phone,
        code: req.body.code,
    }
    if(otp.verifyOtp(obj.phone, obj.code)){
        res.status(200).send({
            "message": 'Verified',
        })
    }else{
        res.status(400).send({
            "message": "Invalid input",
        })
    }
})

app.post('/dummy', (req, res) => {
    res.status(200).send("dummy success");
})

app.listen(port, () => {
    console.log('Server started at port: '+port);
})
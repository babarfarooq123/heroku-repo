const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const otp = require('./twilio');
const app = express();
const mongoose = require("mongoose");
require("./models/registerModel");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

app.use(cors());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const registerUser = mongoose.model('registeredUser');

const url = 'mongodb+srv://admin:allah786@cluster0.m3d4x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// const client = new MongoClient(url);
// const dbName = "myFirstDatabase";

mongoose.connection.on("connected", () => {
    console.log("mongodb connection successfull");
})
mongoose.connection.on("error", () => {
    console.log("mongodb connection error");
})


app.get("/data",async (req,res)=>{
    // try{
    //     await client.connect();
    //     console.log("Connected correctly to server");
    //     const db = client.db(dbName);
    //     collection("registeredUser").then((data)=>{
    //         console.log(data)
    //     });
       
    //     console.log('end');
    // }catch(err){
        // console.log(err.stack())
    // }

    // console.log('data ===>>>');
  let arr = []
   arr=(await registerUser.find({}).then((data)=>{
       return data
   }))

   if(arr){
       console.log(arr);
   }

    // mongoose.Collection("registeredUser").find({}).then((data)=>{
    //     console.log(data);
    // }).catch(()=>{
    //     console.log("not data!")
    // })
})

app.post('/register',(req, res) => {
    const regData = {
        firstName: req.body.fName, 
        lastName: req.body.lName, 
        gender: req.body.gender,
        email: req.body.email,
        otpStatus: false,
        password: req.body.password,
        phone: `+92${req.body.phone}`
    }
    
    registerUser.find({$or: [{"email": regData.email},{"phone": regData.phone}]}).then((data) => {
      
       if(data.length){
        res.json({"status": 'false'});
       }else{
        const user = new registerUser(regData);
            user.save()
            .then(() => {
                registerUser.find({"email": regData.email}).then((data) => {
                    // console.log(data[0]._id);
                    res.json({"status": data[0]._id});
                })
            })
            .catch(() => {
                res.json({"status": 'false'});
            });
       }
    }).catch(() => {
        res.json({"status": 'NETWORK ISSUE'});
    })

    
})

app.post('/getotp', (req, res) => {
    // if(otp.sendOtp(req.body.phone)){
    //     res.status(200).send({
    //         "otp": "send"
    //     })
    // }else{
    //     res.status(503).send({
    //         "message": "Service Unavailable"
    //     })
    // }

    const client = require('twilio')(accountSid, authToken);
  client
    .verify
    .services(serviceId)
    .verifications
    .create({
        to: req.body.phone,
        channel: "sms"
     })
    .then(message => {res.status(200).send({"otp": "send"})})
    .catch(err => {res.status(503).send({"message": "Service Unavailable"})});
})

app.post('/verify', (req, res) => {
    const obj = {
        phone: req.body.phone,
        code: req.body.code,
    }
    // if(otp.verifyOtp(obj.phone, obj.code)){
    //     res.status(200).send({
    //         "message": 'Verified',
    //     })
    // }else{
    //     res.status(400).send({
    //         "message": "Invalid input",
    //     })
    // }

    const client = require('twilio')(accountSid, authToken);
    client
        .verify
        .services(serviceId)
        .verificationChecks
        .create({
            to: obj.phone,
            code: obj.code
        })
        .then(message => {
            res.status(200).send({
                "message": 'Verified',
            })
        })
        .catch(err => {
            res.status(400).send({
                "message": "Invalid input",
            })
        });
})

app.post('/dummy', (req, res) => {
    res.status(200).send("dummy success");
})

app.listen(port, () => {
    console.log('Server started at port: '+port);
})
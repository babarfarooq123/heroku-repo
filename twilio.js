require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

const sendOtp = (phone) => {
  const client = require('twilio')(accountSid, authToken);
  client
    .verify
    .services(serviceId)
    .verifications
    .create({
        to: phone,
       channel: "sms"
     })
    .then(message => {return true})
    .catch(err => {return false});
}
const verifyOtp = (phone, code) => {
  const client = require('twilio')(accountSid, authToken);
  client
    .verify
    .services(serviceId)
    .verificationChecks
    .create({
        to: phone,
       code: code
     })
    .then(message => {return true})
    .catch(err => {return false});
}

// const obj = {
//   sendOtp:sendOtp, 
//   verifyOtp: varifyOtp
// }
module.exports = {
  sendOtp: sendOtp, 
  verifyOtp: verifyOtp
}
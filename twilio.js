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
    .then(message => console.log('otp sent twilio'))
    .catch(err => console.log('otp error twilio', err));
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
    .then(message => console.log("verified"))
    .catch(err => console.log("not verified"));
}

// const obj = {
//   sendOtp:sendOtp, 
//   verifyOtp: varifyOtp
// }
module.exports = {
  sendOtp: sendOtp, 
  verifyOtp: verifyOtp
}
require('dotenv').config();

const accountSid = "AC1538bd57fdd1627cc6dea7032644613a";
const authToken = "f4b4839d1b518b10102fa85179f7a850";
const serviceId = "VA871b3266fd5f9f0a902acf12101abe81";

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
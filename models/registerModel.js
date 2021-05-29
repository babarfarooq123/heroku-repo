const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    firstName: "string",
    lastName: "string",
    gender:"string",
    email: "string",
    otpStatus:"boolean",
    password: "string",
    phone: "string"
})

mongoose.model("registeredUser", registerSchema);
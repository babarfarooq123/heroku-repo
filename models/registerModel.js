const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    firstName: "string",
    lastName: "string",
    phone: "string",
    address: "string",
    password: "string",
})

mongoose.model("registeredUser", registerSchema);
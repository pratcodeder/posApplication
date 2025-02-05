const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (userData) => {
    try {
const existingUser = await User.findOne({email : userData.email});
if(existingUser) {
    throw new Error("User Already exists");
}

const user = new User(userData);
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(userData.password,salt);
user.password = hashedPassword;
await user.save();
return user;

    } catch (error) {
        throw error;
    }
};

const loginUser = async (userData) => {
    try {
const {email , password} = userData;
const user = await User.findOne({email});

if(!user) {
    throw new Error("user not found");
}

const isMatch = await user.comparePassword(password);

if(!isMatch) {
    throw new Error("Invalid credentials");
}

const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
const userId = user._id;
return {token,userId};

    } catch (error) {
        throw error;
    }
};

module.exports = {registerUser, loginUser};
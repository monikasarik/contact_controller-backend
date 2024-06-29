const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");
const User = require("../models/userModel");
// @desc Register a users
// @route post /users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are Mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User are already Registered!");
  }
  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`user created,${user}`);
  if(user){
    res.status(201).json({_id: user.id, email:user.email})
  }else{
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

// @desc Login a users
// @route post /users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password}=req.body;
    if(!email|| !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email });
    //compare password with hashpassword
    if (user && (await bcrypt.compare(password, user.password))){
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        }, process.env.ACCESS_TOKEN_SECERT,
        {expireIn:"900 m"}
    );
        res.status(200).json({ accessToken });
    }else{
        res.status(401)
        throw new Error("email and password is not valid");
    }

});
// @desc current user info
// @route post /users/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user );
});
module.exports = { registerUser, loginUser, currentUser };

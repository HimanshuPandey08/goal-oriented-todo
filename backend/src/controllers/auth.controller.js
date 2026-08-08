const userModel = require("../models/user.model");
const encypt = require("../utils/hashPassword");
const { EMAIL_REGEX } = require("../utils/regex");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


async function registerUserController(req,res) {
    
    try{        
        const { username , email , password } = req.body;

        if(!username || !email || !password ){
            return res.status(400).json({ message : "All Fields are required"})
        }
        if(!(EMAIL_REGEX.test(email))){
            return res.status(400).json({message : "Email is invalid"})
        }

        const isPasswordValid = password.length >=6 
        if(!isPasswordValid){
            return res.status(400).json({message : "Password should be atleat 6 character long."})
        }
        const hash = await encypt(password)

        const isUserExixts =  await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });
        if(isUserExixts){
            return res.status(409).json({message : "User Already exixts"})
        }

        const user = await userModel.create({
            username,
            email,
            password:hash
        })

        const token = jwt.sign(
            { id: user._id, username:user.username },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: "User Registered Successfully",
            user:{
                id:user._id,
                username: user.username,
                email:user.email 
            }
        })
    }
    catch{
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function loginUserController(req,res) {
    
    try {
        const { email , password } = req.body;

        if(!email){
            return res.status(400).json({message : "Email is missing"})
        }
        if(!password){
            return res.status(400).json({message : "Password is missing"})
        }
        if(!(EMAIL_REGEX.test(email))){
            return res.status(400).json({message :"Email is invalid"})
        }
        if(password.length <=5){
            return res.status(400).json({message : "Password is invalid"})
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({message : "User Dosn't Exists"})
        }

        const isPasswordSame = await bcrypt.compare(password,user.password);
        if(!isPasswordSame){
            return res.status(401).json({message :"Passowrd is incorrect"})
        }

        const token = jwt.sign(
            { id: user._id, username:user.username },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "User Loggined Successfully",
            user:{
                id:user._id,
                username: user.username,
                email:user.email 
            }
        })
    } 
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {  registerUserController , loginUserController }
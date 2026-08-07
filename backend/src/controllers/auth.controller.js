const userModel = require("../models/user.model");
const encypt = require("../utils/hashPassword");
const { EMAIL_REGEX } = require("../utils/regex");
const jwt = require("jsonwebtoken")


async function registerUserController(req,res) {
    
    try{        
        const { username , email , password } = req.body;

        if(!username || !email || !password ){
            return res.status(400).json({ message : "All Fields are required"})
        }

        if(!(EMAIL_REGEX.test(email))){
            return res.status(400).json({message : "Email is invalid "})
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


module.exports = {  registerUserController }
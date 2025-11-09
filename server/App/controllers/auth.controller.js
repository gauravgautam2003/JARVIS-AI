import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"


export const signUp = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const userEmail = await User.findOne({email});

        if(userEmail){
            return res.status(400).json({message:"email already exist"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"password must be 6 character long"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            
        });
        
    const token = await genToken(user._id)
        
        res.cookie("token", token, {
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"none",
            secure:true
        })

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"signUp error"});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"email does not exist"});
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"incorrect password"});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
    
        
    const token = await genToken(user._id)
    
        res.cookie("token", token, {
            httpOnly:true,
            maxAge:7*24*60*60*1000,
              sameSite:"none",
            secure:true
        })

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({message:"signIn error"});
    }
}

export const logOut = async (req, res) =>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"log out succesfully"});
    } catch (error) {
        return res.status(400).json({message:"log out error"});
    }
}

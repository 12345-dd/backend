const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../config/db")
const secret = "mayur"

const registerUser = async(req,res) => {
    const {firstName,lastName,mobileNumber,password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        const [result] = await db.query(
            "INSERT INTO users(first_name,last_name,mobile_number,password_hash,created_by) VALUES (?,?,?,?,?)",
            [firstName,lastName,mobileNumber,hashedPassword,"Admin"]
        );
        res.status(201).json({
            message:"User Registered Successfully",
            userId:result.insertId
        })
    } catch(err){
        res.status(500).json({
            message:"Server Error",
            error: err.message
        })
    }
}

const loginUser = async(req,res) => {
    const {mobileNumber,password} = req.body;
    try{
        const [result] = await db.query(
            "SELECT * FROM users WHERE mobile_number = ?",[mobileNumber]
        );
        if(result.length == 0){
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password,user.password_hash);
        if(!isMatch){
            res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const token = jwt.sign({id:user.id},secret,{expiresIn:"1hr"});
        res.status(200).json({
            user:user,
            token:token
        })
    } catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}

const getUserById = async(req,res) => {
    const {id} = req.params;
    try{
        const [result] = await db.query("SELECT * FROM users WHERE id = ?",[id]);
        if(result.length == 0){
            res.status(404).json({
                message:"User Not Found"
            })
        } else {
            res.status(200).json({
                data:result[0]
            })
        }
    } catch(err){
        res.status(500).json({
            message:"Server Error",
            error:err.message
        })
    }
}

const getUsers = async(req,res) => {
    try{
        const [result] = await db.query("SELECT * FROM users");
        if(result.length == 0){
            res.status(404).json({
                message:"User Not Found"
            })
        } else {
            res.status(200).json({
                data:result
            })
        }
    } catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    getUsers
}
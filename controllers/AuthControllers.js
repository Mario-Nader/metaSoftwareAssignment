const DBcontrollers = require('../database')
const jwt = require('jsonwebtoken');

function createToken(id){
    return jwt.sign({id},process.env.secretTokenString,{expiresIn:24*60*60})
}

async function signup(req,res){
    try{
       let {username,password} = req.body
       const name = username.toLowerCase() 
       const userID = await DBcontrollers.createUser(name,password)
       token = createToken(userID)
       res.cookie('token',token,{httpOnly:true, maxAge:24*60*60*1000})
       res.status(201).json({ message: "User created" })
    }catch(err){
        console.log(err.message)
        res.status(500).json({message:"error happened while creating the user please report it and try again later"})
    }
}

async function login(res,req){
try{
    let{username,password} = req.body
    const name = username.toLowerCase()
    let ID//for the resault of the search for the user by name
    const candidates = DBcontrollers.getUserByName(name)
    if(!candidates){
        return res.status(400).json({message:"username or password are not correct"})//this will get invoked if the username is not correct but I put it like this for security reasons
    }else{
        let correctPassword = false
        candidates.forEach(async element => {
            correctPassword = await bcrypt.compare(password,element.PasswordHash)
            if(bool){
                ID = element.ID
                return
            }
        }
    );
    if(!correctPassword){
    return res.status(400).json({message:"username or password are not correct"})//this will get invoked if the password is not correct but I put it like this for security reasons
    }
    }
    const token = createToken(ID)
    res.cookie("token",token,{httpOnly:true,maxAge:24*60*60*1000})
    res.status(200).json({message:"login successful"})
}catch(err){
    console.log(err.message)
    return res.status(500).json({message:"couldn't login"});
}
}

function authenMid(req,res,next){
    const token = req.cookies.token;
    if(token){
        jwt.verify(token,process.env.secretTokenString,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.status(400).json({"msg":"you must be loged to do this request"})
            }else{
                next()
            }
        })
        
    }else{
        console.log(err.message);
        res.status(400).json({"msg":"you must be loged in to do this request"})
    }
}

function logout(req,res){
    try{
    res.cookie('token',"",{httpOnly:true, maxAge:1});
    res.status(204).json({
        "success": true,
        "message": "User signed out successfully"
      })
    }catch(err){
        console.log(err);
    }
}

async function verifyUser(req,res,next){
    token = req.cookies.token;
    let id = 0;
    if(!token){
        res.status(401).json({"msg":"unauthorized access"});
    }else{
        jwt.verify(token,process.env.secretTokenString,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.status(401).json({"msg":"unauthorized access"});
            }else{
                 id = decodedToken.id;
            }
        })
    }
    const user = await DBcontrollers.getUserByID(id);
    if(!user){
        res.status(404).json({"msg":"user not found"})
    }else{
        req.id = id;
        next();
    }
}


module.exports = {signup,login,authenMid,verifyUser,logout}
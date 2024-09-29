import BusinessOwnerModel from "../Models/BusinessOwnersModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import Twilio from "twilio";

const serviceID = "VA07b529d4786c4c749a133ac423b1893f"            
const accountSID =  "ACd0f87bcfd1bcfd66cdda0e623ed13473"
const authToken = "18973808512f21b045bddb9e84f2e9c9"
const client = new Twilio(accountSID, authToken);
//registering a new user
export const registerUser=async (req,res)=>{
    console.log("haiii")  
     const salt=await bcrypt.genSalt(10)
     const hashedPass= await bcrypt.hash(req.body.password,salt)
     req.body.password=hashedPass
     console.log(" password",req.body.password)
     console.log(" hashedpassword",hashedPass)
     const newUser =BusinessOwnerModel(req.body)
     const {email}=req.body
     try {
  
  
      const oldUser=await BusinessOwnerModel.findOne({email})
      if(oldUser){
          return res.status(400).json({message:"username already exist"})
      }
  
      var Transport=nodemailer.createTransport({
        service:"Gmail",
        auth:{
          user:"possindia21@gmail.com",
          pass:"wykvjbreaetbjxvm"
        }
      })
  
      var mailOptions;
      let sender="PossIndia"
      mailOptions={
          from:sender,
          to:email,
          subject:"Email confirmation",
          html:`press   <a href="http://localhost:3000">here</a> to verify`
      }
  
  
      Transport.sendMail(mailOptions,(err,response)=>{
        if(err){
          console.log(err);
        }else{
          console.log(response);
      }
      })
       const user= await newUser.save();
  
       const token=jwt.sign({
          username:user.email, id:user._id
       },process.env.JWT_KEY,{expiresIn:'1h'})
  
  
  
       res.status(200).json({user,token});
  
  
     } catch (error) {
        res.status(500).json({message:error.message})
     }
  }
  
  //login User
  
  export const loginUser= async(req,res)=>{
      const {email,password}=req.body;
  
    
      try {
         const user=await BusinessOwnerModel.findOne({email: email})
         console.log(user.password)
         if(user){
          const validity=await bcrypt.compare(password, user.password)
  
         if(!validity){
            res.status(400).json("Wrong password")
         }else if(user.auth===false){
           console.log(user.auth)
           res.status(401).json("Action forbidden")
         }
         else{
          const token=jwt.sign({
              username:user.email, id:user._id
           },process.env.JWT_KEY,{expiresIn:'1h'})
  
           res.status(200).json({user,token})
         }
      }
      else{
          res.status(404).json("User does not exist")
      }
      } catch (error) {
          res.status(500).json({message:error.message})
      }
  }
  
  
  //for sending otp
  export const otpValidation = async (req, res) => {
     try {
   
       console.log(req.body.number);
       const resp = await client.verify.services(serviceID).verifications.create({
         to: `+91${req.body.number}`,
         channel: "sms",
       });
       if(resp){
        console.log(resp);
       }else{
        console.log("no resp");
       }
       res.status(200).json(resp);
     } catch (error) {
       res.status(500).json(error);
     }
   };
   //for verifying otp
   export const otpVerification = async (req, res) => {
     try {
       const { otp, number } = req.body;
       const resp = await client.verify
         .services(serviceID)
         .verificationChecks.create({
           to: `+91${number}`,
           code: otp,
         });
       console.log(resp);
       res.status(200).json(resp);
     } catch (error) {
       res.status(500).json(error);
     }
   };
//get all users

export const getAllUser=async (req,res)=>{
    try {
       let users=await BusinessOwnerModel.find() 

       users=users.map((user)=>{
          const {password,...otherDetails}=user._doc
           return otherDetails
       })
       res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}

//get a user

export const getUser=async (req,res)=>{
    const id=req.params.id
    try {
        
        const user=await BusinessOwnerModel.findById(id)
        if(user)
        {
            const {password,...otherDetails}=user._doc
            res.status(200).json(otherDetails)
        }
        else
        {
            res.status(404).json("No such user found")
        }
        
    } catch (error) {
         res.status(500).json(error)
    }
}

//update a user

export const updateUser=async(req,res)=>{

    const id=req.params.id;
    const {_id,currentUserAdminStatus,password}=req.body;
     
   


    if(id===_id ){
        try {

            if(password)
            {
              const salt =await bcrypt.genSalt(10)
              req.body.password= await bcrypt.hash(password,salt) 
            }
           const user =await BusinessOwnerModel.findByIdAndUpdate(id,req.body,{new:true})

          const token=jwt.sign({
            username:user.username,
            id:user._id
          },process.env.JWT_KEY,{expiresIn:"1h"})
           res.status(200).json({user,token})


        } catch (error) {
            res.status(500).json(error) 
        }
    }else{
        res.status(403).json("Access denied ! you can update only ypur own profile")
    }
}

export const deleteUser=async (req,res)=>{
    const id=req.params.id;
    const  {currentUserId,currentUserAdminStatus}=req.body;
    if(currentUserId===id || currentUserAdminStatus){
       try {
          await BusinessOwnerModel.findByIdAndDelete(id)
          res.status(200).json("User deleted successfully")
       } catch (error) {
        res.status(500).json(error) 
        
       }
    }
    else{
        res.status(403).json("Access denied ! you can delete only ypur own profile")
    }
}

export const followUser=async (req,res)=>{
    const id =req.params.id
    const {_id}=req.body;

    if(_id===id){
        res.status(403).json("Action Forbidden")
    }else{
        try {
           const followUser=await BusinessOwnerModel.findById(id) 
           const followingUser=await BusinessOwnerModel.findById(_id)
           if(!followUser.followers.includes(_id)){
               await followUser.updateOne({$push:{followers:_id}})
               await followingUser.updateOne({$push:{following:id}})
               res.status(200).json("user followed")
           }else{
            res.status(403).json("User Already folowed by you")
           }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)  
        }
    }
}
//unfollow user
export const unFollowUser=async (req,res)=>{
    const id =req.params.id
    const {_id}=req.body;

    if(_id===id){
        res.status(403).json("Action Forbidden")
    }else{
        try {
           const followUser=await BusinessOwnerModel.findById(id) 
           const followingUser=await BusinessOwnerModel.findById(_id)
           if(followUser.followers.includes(_id)){
               await followUser.updateOne({$pull:{followers:_id}})
               await followingUser.updateOne({$pull:{following:id}})
               res.status(200).json("user unfollowed")
           }else{
            res.status(403).json("User is not folowed by you")
           }
        } catch (error) {
            res.status(500).json(error)  
        }
    }
}

export const blockUser=async(req,res)=>{
    const userId=req.params.id
    try {
        const user=await BusinessOwnerModel.findByIdAndUpdate({_id:userId},{
            auth:false
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const UnblockUser=async(req,res)=>{
    const userId=req.params.id
    try {
        const user=await BusinessOwnerModel.findByIdAndUpdate({_id:userId},{
            auth:true
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}
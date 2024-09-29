import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors"
import BusinessOwnerRoute from "./Routes/BusinessOwnerRoute.js"
const app=express();

app.use(express.static("public"))
app.use("images",express.static("images"))
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
 
app.use(cors())
dotenv.config() 

mongoose.connect(process.env.MONGO_DB,
    {}
    ).then(()=>{
        app.listen(process.env.PORT,()=>console.log("Listening @",process.env.PORT))
    }).catch((err)=>{
       console.log(err);
    })

app.get("/test",(req,res)=>{
    res.send("hello ")
})

app.use("/api",BusinessOwnerRoute)
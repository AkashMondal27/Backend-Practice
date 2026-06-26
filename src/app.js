import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//setting to get different types of data --Json , Url , public files
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))   //store file store in my server 

//add the cookies 
app.use(cookieParser())


export default {app}
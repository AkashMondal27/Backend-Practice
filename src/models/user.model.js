import mongoose, { Schema } from "mongoose";

const userSchema= new mongoose.Schema({
   username:
    { type:String,
     required :true,
     lowecase: true,
     unique:true,
     trim:true,
     index: true
   },
   email:
    { type:String,
     required :true,
     unique:true,
     lowecase: true,
     trim:true,
   },
   fullname:
    { type:String,
     required :true,
     trim:true,
     index: true
   },
   avatar:
    { type:String,  // cloudinary Url
        required:true
   },
    coverImage:
    { type:String,  // cloudinary Url
   },
   watchHistory:[
    {
        type:mongoose.Schema.types.ObjectId,
        ref:"video"

    }
   ],
   password:{
    type:String,
    required:[true ,'Password is required']
   },
   refreshToken :{
    type:String
   }

},{timestamps:true})

export const User= mongoose.model("User",userSchema)
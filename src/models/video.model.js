import mongoose from "mongoose";

const videoSchema=new mongoose.Schema({
    videofile:{
        type:String ,  // cloudinary Url
        required:true
    },
    thumnail:{
        type:String ,  // cloudinary Url
        required:true
    },
    title:{
        type:String ,
        required:true
    },
    description:{
        type:String ,  
        required:true
    },
    duration:{
        type:Number , //clodinary 
        required:true
    },
    views:{
        type:Number,
        default:0 
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})


export const Video = mongoose.model("Video",videoSchema)
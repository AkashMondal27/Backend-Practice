import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username:
  {
    type: String,
    required: true,
    lowecase: true,
    unique: true,
    trim: true,
    index: true
  },
  email:
  {
    type: String,
    required: true,
    unique: true,
    lowecase: true,
    trim: true,
  },
  fullName:
  {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  avatar:
  {
    type: String,  // cloudinary Url
    required: true
  },
  coverImage:
  {
    type: String,  // cloudinary Url
  },
  watchHistory: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: "video"

    }
  ],
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  refreshToken: {
    type: String
  }

}, { timestamps: true })



// This middleware runs automatically BEFORE a user document is saved
userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next();  // This middleware runs automatically BEFORE a user document is saved

  this.password = bcrypt.hash(this.password, 10)  // This middleware runs automatically BEFORE a user document is saved,10 is the salt rounds 
  next()
})



/* Create a custom method for the User model to check whether the password entered by the user
 matches the hashed password stored in the database.  */

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)     // password -> plain-text password entered during login
  // this.password   -> hashed password stored in MongoDB
}




/*Gnerate AccessToken :-This method creates a JWT Access Token for the logged-in user.
                       Access Token is short-lived and is used to authenticate API requests. */
userSchema.methods.generateAccessToken = async function(){
  return jwt.sign(     // jwt.sign() creates a new token.
    {
    _id:this._id,
    email:this.email,
    username:this.username,
    fullName:this.fullName
  },
  process.env.ACCESS_TOKEN_SECRET,     // jwt.sign() creates a new token.
  {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
  )
}


/*Generate Refresh Token :-This method creates a Refresh Token.
                    They are used to generate a new Access Token
                     without asking the user to log in again. */
userSchema.methods.generateRefreshToken= async function(){
   return jwt.sign(
    {
    _id:this._id, 
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
  )
}


export const User = mongoose.model("User", userSchema)
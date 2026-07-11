import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js";


/* Demo code ,just to check the rsponse in Postman 

const registerUser =asyncHandler(async(req , res)=>{
    res.status(200).json({
        message : 'Open postman & check the response . Response successfully get '
    })
})     */


const registerUser = asyncHandler(async (req, res) => {

   /*  Step:-1 -------------------------------------------------------------------------
                       Get the data from body / frontend
    -------------------------------------------------------------------------------------- */

   const { fullName, email, username, password } = req.body

   console.log(req.body);

   /* Step:2-------------------------------------------------------------------
                  Validate the Input 
      -------------------------------------------------------------------------


    if (!fullName || fullName.trim() === "") {
        throw new ApiError(400, "Full Name is required.");
    }

    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required.");
    }
    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Validate Gmail format
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;

    if (!emailRegex.test(lowerCaseEmail)) {
     throw new ApiError(
        400,
        "Please enter a valid Gmail address (example@gmail.com)."
       );
    }
       
    if (!username || username.trim() === "") {
        throw new ApiError(400, "Username is required.");
    }
   

    if (!password || password.trim() === "") {
        throw new ApiError(400, "Password is required.");
    }  */



   // check every condition in one like using arrat.some method
   if (
      [fullName, email, username, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }
   // Convert email to lowercase
   const lowerCaseEmail = email.toLowerCase();

   // Validate Gmail format
   const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;

   if (!emailRegex.test(lowerCaseEmail)) {
      throw new ApiError(
         400,
         "Please enter a valid Gmail address (example@gmail.com)."
      );
   }


   /* Step:3 ----------------------------------------------------------------------
                      Check if the user already exists.
    --------------------------------------------------------------------------------*/

   const existedUser = await User.findOne({
      $or: [{ username }, { email }]   /*In MongoDB, $ indicates a special operator that perform a 
                                    specific operation, like OR, AND, greater than, less than, etc.*/
   })
   if (existedUser) {
      throw new ApiError(409, "User email or Username already exits  ")
   }

   /* Step:-4 ------------------------------------------------------------------------------
                  Image & Avatar upload 
    ---------------------------------------------------------------------------------------*/
   const avatarLocalPath = req.files?.avatar[0]?.path;        //Check the Notes bellow for the working process👇
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
   // coverimage is optional so we need this logic 
   let coverImageLocalPath;

   // Check whether a cover image has been uploaded
   if(
      req.files && 
      Array.isArray(req.files.coverImage) &&
       req.files.coverImage.length >0
      ){
         // Store the local file path of the uploaded cover image.
         coverImageLocalPath=req.files.coverImage[0].path
       }else{
        console.log("Cover image is not uploaded (Optional)")
       }


    console.log(req.files);


   if (!avatarLocalPath) {
      throw new ApiError(400, "Avator Image is required ")
   }

   /* Step :-5 ------------------------------------------------------------------------------
                     Upload images to Cloudinary
      --------------------------------------------------------------------------------------*/

      const avatar=  await uploadonCloudinary(avatarLocalPath);
      const coverImage= await uploadonCloudinary(coverImageLocalPath);

   /* Step :-6 ------------------Verify successful upload.------------------------*/

      // if(!avatar){
      //    throw new ApiError(400, "Failed to upload avatar to Cloudinary")
      // }
     if (!avatar) {
        return res.status(500).json({
        message: "Failed to upload avatar to Cloudinary"
      });


}
   /*Step :-7 ---------------------------------------------------------------------------------
                            Create the user in the database
   -----------------------------------------------------------------------------------------*/
    
    const user= await User.create(
      {  fullName,
         avatar:avatar.url,
         coverImage: coverImage?.url || " ",
         email,
         password,
         username: username.toLowerCase(),        
      }
     )
   
   /*Step :-8 & 9 ---------------------------------------------------------------------------
                      Verify user creation & remove all the sensitive fields
      --------------------------------------------------------------------------------*/
         const createdUser= await User.findById(user._id).select(
            "-password -refreshToken"        //Check the Notes bellow for the working process👇
         )     
      
         if(!createdUser){
            throw new ApiError(500 , 'Something went wrong while registring the user  ,user.controllers.js ')
         }

   /* Step:-10 --------------------------------------------------------------------------
               Send a success  / API response      
      ---------------------------------------------------------------------------------*/
    
      return res.status(201).json(
         new ApiResponse(200 ,createdUser,"User registered successfully 👍")
      )
         
})

export { registerUser };





/* ============================
        Register User Flow
 ============================

 1. Extract user details from the request body.
    - fullname
    - username
    - email
    - password

 2. Validate the input.
    - Ensure all required fields are present.
    - Trim whitespace.
    - Validate email format.
    - Validate password strength.

 3. Check if the user already exists.
    - Search by email.
    - Search by username.
    - Return an error if a duplicate user is found.

 4. Extract uploaded files.Check the images and avatar
    - Avatar (Required)
    - Cover Image (Optional)

 5. Upload images to Cloudinary.
    - Upload avatar.
    - Upload cover image (if provided).

 6. Verify successful upload.
    - Ensure avatar URL is returned.
    - Handle upload failures.

 7. Create the user in the database.
    - Save user information.
    - Store Cloudinary image URLs.
    - Hash password using a pre-save middleware.

 8. Verify user creation.
    - Return an error if creation fails.

 9. Retrieve the created user.
    - Exclude sensitive fields.
    - Remove password.
    - Remove refresh token.

 

 10. Send a success response.
     - HTTP Status: 201 (Created)
     - Return user data and success message.

------------------------------------------------------------------------------
                     Notes    
-----------------------------------------------------------------------------                     
Step:4 :- Image & Avatar upload 

 Extract the local path of the uploaded avatar image from Multer.
 Optional chaining ensures the code doesn't crash if the file is missing.

const avatarLocalPath = req.files?.avatar[0]?.path;

Explanation
req.files → Contains all uploaded files processed by Multer.
avatar → The field name used for the avatar upload.
[0] → Accesses the first uploaded avatar file (since Multer stores files in an array).
.path → Gets the temporary local path where Multer saved the file.
?. (optional chaining) → Prevents errors if req.files, avatar, or the first file doesn't exist, returning undefined instead.


Step:- Verify user creation.

Retrieve the newly created user from the database while excluding
 sensitive fields like password and refresh token.

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
);


findById()  :-Searches a document using its _id.
user_id :- Autometically created mongodb id 
select() :- select everythning in side this mongodp is . 
-   using - sign write those things which i do not need to publish 


 */

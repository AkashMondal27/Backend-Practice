import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

// Write a commen method for Access & Refresh token for future use 

const generateAccessAndRefreshToken = async (userId) => {
   try {
      // 1.Find the user in the database using the user's ID
      const user = await User.findById(userId);
        if(!user){
         throw new ApiError(404 , "User not found" )
        }

      // 2. Generate a short-lived Access Token
      const accessToken = await user.generateAccessToken();

      // 3. Generate a long-lived Refresh Token
      const refreshToken = await user.generateRefreshToken();

      // 4. Store the Refresh Token in the user's document (update databade )
      user.refreshToken = refreshToken;

      // 5. Save the updated user in databade (update databade )
      await user.save({ validateBeforeSave: false })

      // 6. Return both generated tokens  
      return { accessToken, refreshToken }


   } catch (error) {
      console.log(error);

      throw new ApiError(500, "something went wrong while generating Access & Refresh token ")

   }
}


// Step: 1 - Get login credentials from the request body.

const loginUser = asyncHandler(async (req, res) => {

   const { email, username, password } = req.body

   // Step:-2. Validate the input.
   if (!email && !username) {
      throw new ApiError(400, "Email or password is required ")
   }

   // Step:-3. Find the user in the database.
   const user = await User.findOne({
      $or: [{ email }, { username }]
   })


   //Step:-4. Verify the user exists.
   if (!user) {
      throw new ApiError(404, 'User not found')
   }

   //Step:-5. Verify the new user  password.
   const isPasswordValid = await user.isPasswordCorrect(password)   // ispasswordCorrect funcation in already created in user.modules.js 

   if (!isPasswordValid) {
      throw new ApiError(401, " Wrong Password , Please enter correct password");
   }

   //Step:-6. Generate Access Token and Refresh Token.
   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

   //step:-7. Retrieve the logged-in user.   (details explanation ⬇️⬇️)
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   //Step:-8. Configure and Set authentication cookies.

   const options = {     //(details explanation ⬇️⬇️)
      httpOnly: true,
      secure: true
   }

   return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
         new ApiResponse(
            200,
            {
               user: loggedInUser, accessToken, refreshToken
            },
            "User loggged in Successfully "
         )

      )
})


const logoutUser = asyncHandler(async (req, res) => {

  //Step :-1. Get the authenticated user's ID.
   await User.findByIdAndUpdate(
      req.user._id,
      {
         refreshToken: undefined  // Step:-2. Remove the Refresh Token.
      },
      {
         new: true
      }
   )
   
   //Step:-3. Configure cookie options.
   const options = {     //(details explanation ⬇️⬇️)
      httpOnly: true,
      secure: true
   }

   //Step:4. Clear authentication cookies.
   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
         new ApiResponse(200, {}, "User Sucessfully Logged out ")
      )  //5. Send a success response.

})


//Generate refresh AccessToken endpoint

const refreshAccessToken = asyncHandler(async (req, res) => {

   //1 - Get the refresh token from cookies or the request body.
   const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
 
   //2.- Validate the Refresh Token.
   if (!incommingRefreshToken) {
      throw new ApiError(401, "Unauthorized request ")
   }

   try {
      //3.- Verify and decode the refresh token using the secret key
      const decodedToken = jwt.verify(
         incommingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
      )

      //4.- Find the user whose ID is stored inside the decoded token
      const user = await User.findById(decodedToken?._id)

      if (!user) {
         throw new ApiError(404, 'Invalid Refresh Token')
      }

      //5.- Compare the incoming refresh token with the one stored in the database
      if (incommingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, " Refresh token is expired or used ")
      }

      //6.- Generate a new access token and a new refresh token
      const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user?._id)


      //7.-Cookie configuration
      const options = {
         httpOnly: true,
         secure: true
      }
      
      //8.-Send the newly generated tokens as cookies and also return them in the response body
      return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", refreshToken, options)
         .json(
            new ApiResponse(
               200,
               { accessToken, newRefreshToken },
               "Access token regenerate ot refresh ")
         )
   } catch (error) {
     
      throw new ApiError(401, error?.message || "Invaluid refresh token")
   }


})

export { loginUser, logoutUser  ,refreshAccessToken}



/*===============================================================================================================

 LOGIN USER                generateAccessAndRefreshToken         refreshAccessToken                   LOGOUT USER
 ──────────                     ───────────────                    ─────────────                     ───────────

 Request                        Receive User ID                   Receive Refresh Token             Authenticated User
     │                               │                                   │                                │
     ▼                               ▼                                   ▼                                ▼
 Get Email / Username /          Find User by ID                  Read Token from                 Read req.user._id
 Password                            │                             Cookie / Request Body                │
     │                               ▼                                   │                                ▼
     ▼                         User Exists?                              ▼                         Remove Refresh Token
 Validate Input                      │                           Token Present?                  ($unset refreshToken)
 (Email OR Username)            No ─► Error                           │                                │
     │                         Yes ▼                              No ─► 401 Error                     ▼
     ▼                               │                           Yes ▼                        Create Cookie Options
 Find User by                    Generate Access Token                 │                        (httpOnly, secure)
 Email / Username                     │                                ▼                                │
     │                               ▼                         Verify JWT using                        ▼
     ▼                         Generate Refresh Token          REFRESH_TOKEN_SECRET            Clear Access Token Cookie
 User Exists?                         │                                │                                │
 No ─► Error                          ▼                                ▼                                ▼
 Yes ▼                        Save Refresh Token              Extract User ID             Clear Refresh Token Cookie
     │                        in Database                           │                                │
     ▼                               │                                ▼                                ▼
 Verify Password                     ▼                         Find User by ID                Return Success (200)
 (Compare Hashed Password)      Save User                           │
     │                      (validateBeforeSave:false)              ▼
     ▼                               │                         User Exists?
 Generate Access Token               ▼                          No ─► Error
 Generate Refresh Token        Return Tokens                      Yes ▼
     │                                                             │
     ▼                                                             ▼
 Save Refresh Token                                     Compare Incoming Token
 in Database                                           with Stored Refresh Token
     │                                                             │
     ▼                                                      Tokens Match?
 Get Logged-in User                                           No ─► 401 Error
 (Exclude Password &                                          Yes ▼
 Refresh Token)                                                  │
     │                                                           ▼
     ▼                                                Generate New Access Token
 Create Cookie Options                               Generate New Refresh Token
 (httpOnly, secure)                                          │
     │                                                       ▼
     ▼                                             
 Set Access Token Cookie                                     
     │                                                       
     ▼                                             Set New Authentication Cookies
 Set Refresh Token Cookie                                     │
     │                                                       ▼
     ▼                                             Return New Tokens + Success
 Return User +
 Tokens + Success

===============================================================================================================
✒️✒️  Step:7  dedails explanation
-----------------------------
Why do we fetch the user again from the database?

const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");


After generating and saving the refresh token, we fetch the user again to prepare a **clean response** for the frontend.

This allows us to:

* Retrieve the latest user data from the database.
* Exclude sensitive fields like `password` and `refreshToken`.
* Send only the necessary user information (such as name, email, username, avatar, etc.) to the frontend.

The frontend uses this data to update the user interface (e.g., display the logged-in user's profile, name, or avatar) without making another API request.

---------------------------------------------------------
✒️✒️ Step:-8. Configure and Set authentication cookies.
-------------------------------------------------------
✅httpOnly: true

Prevents client-side JavaScript from accessing or modifying the cookie.
Only the browser and backend can use the cookie during HTTP requests.

✅secure: true
Ensures the cookie is sent only over HTTPS connections.
This protects authentication tokens from being transmitted over an insecure network.

*/
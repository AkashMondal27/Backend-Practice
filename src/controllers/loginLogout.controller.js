import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";


   // Write a commen method for Access & Refresh token for future use 

    const generateAccessAndRefreshToken=async(userId)=>
     {
        try {
            // 1.Find the user in the database using the user's ID
            const user= await User.findById(userId);

            // 2. Generate a short-lived Access Token
            const accessToken=user.generateAccessToken();

            // 3. Generate a long-lived Refresh Token
            const refreshToken=user.generateRefreshToken();

            // 4. Store the Refresh Token in the user's document (update databade )
            user.refreshToken=refreshToken;

            // 5. Save the updated user in databade (update databade )
            await user.save({validateBeforeSave:false})

            // 6. Return both generated tokens  
            return{accessToken ,refreshToken}
      

        } catch (error) {
            throw new ApiError(500 , "something went wrong while generating Access & Refresh token ")
                  
        }
    }


 // Step: 1 - Get login credentials from the request body.
  
 const loginUser=asyncHandler(async(req,res)=>{

    const { email,username , password}=req.body

    // Step:-2. Validate the input.
    if(!email || !username){
        throw new ApiError(400, "Username or password is required ")
    }
  
    // Step:-3. Find the user in the database.
    const user= await User.findOne({
        $or:[{email}, {username}]
    })


    //Step:-4. Verify the user exists.
     if(!user){
        throw new ApiError(404 ,'User not found')
    }

    //Step:-5. Verify the new user  password.
    const  isPasswordValid= await user.isPasswordCorrect(password)   // ispasswordCorrect funcation in already created in user.modules.js 

    if(!isPasswordValid){
        throw new ApiError(401 ," Wrong Password , Please enter correct password");
    }
    
    //Step:-6. Generate Access Token and Refresh Token.
    const{accessToken , refreshToken}= await generateAccessAndRefreshToken(user._id)

    //step:-7. Retrieve the logged-in user.   (details explanation ⬇️⬇️)
    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")
    
    //Step:-8. Configure and Set authentication cookies.

    const option={     //(details explanation ⬇️⬇️)
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser ,accessToken,refreshToken
            },
            "User login Successfully "
        )

    )
 })


  const logoutUser=asyncHandler(async(req,res)=>{

  })




export {loginUser}




/*-------------------------------------------------------------------------------------------
                                   Login User Flow
--------------------------------------------------------------------------------------------

1. Get login credentials from the request body.
   - Email
   - Username
   - Password

2. Validate the input.
   - Ensure either Email or Username is provided.

3. Find the user in the database.
   - Search by Email or Username.

4. Verify the user exists.
   - If no user is found, return an error.

5. Verify the new user password
   - Compare the entered password with the hashed password.

6. Generate Access Token and Refresh Token.
   - Save the Refresh Token in the database.

7. Retrieve the logged-in user.
   - details explanation ⬇️⬇️
   - Exclude password and refreshToken from the response.

8. Configure and Set authentication cookies.
   - Create cookie options.
   - Store Access Token in an HTTP-only cookie.
   - Store Refresh Token in an HTTP-only cookie.

9. Send a success response.
   - Return user details.
   - Return Access Token and Refresh Token.
   - Return success message.

-------------------------------------------------------------------------------------------
                    enerateAccessAndRefreshToken flow
 -----------------------------------------------------------------------------------------
 
1. Find the user in the database using the user's ID

2. Generate a short-lived Access Token
   - call generateAccessToken(), 
   - already created in user.modules.js 

3. Generate a long-lived Refresh Token
   - call generateRefreshToken()
   - already created in user.modules.js 

4. Store the Refresh Token in the user's document  -update databade 
5. Save the updated user document in database .Skip schema validation -update databade 
    because only the refreshToken field is being updated.
6. Return both generated tokens   

---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
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
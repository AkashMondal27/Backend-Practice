import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT= asyncHandler(async(req,res,next)=>{

    try {
        const token = 
        req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ","")
    
         if(!token){
            throw new ApiError(401 , "Unauthorized request")
         }
    
         const decodedToken= await jtw.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
         const user=  await  User.findById(decodedToken?._id).select("-password -refreshToken")
    
         if(!user){
            throw new ApiError( 401 ,"Invalid Access Token")
         }
    
         req.user=user
         next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
        
    }
})


/*-------------------------------------------------------------------------------------------
                           Verify JWT Authentication Flow
--------------------------------------------------------------------------------------------

1. Get the Access Token.
   - Read the token from cookies or the Authorization header.

2. Validate the Access Token.
   - Ensure the token is present.

3. Verify the JWT.
   - Decode the token using the Access Token Secret.

4. Find the authenticated user.
   - Search the database using the decoded user ID.

5. Verify the user exists.
   - If no user is found, return an authentication error.

6. Attach the user to the request object.
   - Makes the authenticated user's data available to the next middleware or controller.

7. Pass control to the next middleware.
   - Continue processing the request.

8. Handle authentication errors.
   - Return an "Invalid Access Token" error if token verification fails.

-------------------------------------------------------------------------------------------*/

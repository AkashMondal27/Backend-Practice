import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";



const chnageCurrentPassword = asyncHandler(async (req, res) => {

    // Step: 1 - Get login credentials details  from the request body.
    const { oldPassword, newPassword, confirmPassword } = req.body

    //Step:-2. Verify newPassword & oldPassword
    if (newPassword !== confirmPassword) {
        throw new ApiError(
            400,
            "New Password and Confirm Password do not match"
        );
    }

    //Step :3. find the user id 
    const user = await User.findById(req.body?._id)
    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    /*Step:-4. Check the old password is correct or not 
    (user have ti give the old password to verify thir identaty so that thay can set new one)*/
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, " Invalied Old Password ")
    }

    //Step:-5. Set & sace New Password
    user.password = newPassword
    await user.save({
    validateBeforeSave: false
});

    //Step:-6.  Send message to frontend 
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changes Successfully "))


})


// Create a end poin to get the user after changing the Password
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        );
});

export{chnageCurrentPassword ,getCurrentUser}
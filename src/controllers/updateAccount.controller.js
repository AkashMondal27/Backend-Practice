// Seperated Controller to update any other details rather then , password 

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const updateAccountDetails = asyncHandler(async (req, res) => {

    //step:-1. Get the details from user 
    const { fullName, email } = req.body

    //verify the detils 
    if (!fullName || !email) {
        throw new ApiError(400, " fullname or email isnot fund")
    }

    //Step :3. find the user  bu user id 
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        },
        { new: true }  //Return UPDATED Document
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse
            (200,
                user,
                "Account Details Update Successfully "
            )
        )

})

export {updateAccountDetails};
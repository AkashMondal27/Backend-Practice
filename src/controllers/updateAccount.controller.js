// Controller to update user's Full Name and Email

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";


const updateAccountDetails = asyncHandler(async (req, res) => {

    // Step 1: Get full name and email from request body
    const { fullName, email } = req.body;

    // Step 2: Check if both fields are provided
    if (!fullName || !email) {
        throw new ApiError(400, "Full Name and Email are required");
    }

    // Step 3: Update user's full name and email
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true } // Return updated user
    ).select("-password"); // Don't send password

    // Step 4: Send success response
    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Full Name and Email updated successfully"
        )
    );

});


/*----------------------------------------------------------
        Controller to Update User Avatar
----------------------------------------------------------*/

const updateUserAvatar = asyncHandler(async (req, res) => {

    // Step 1: Get avatar file path from Multer
    const avatarLocalPath = req.file?.path;

    // Step 2: Check if file exists
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // Step 3: Upload avatar to Cloudinary
    const avatar = await uploadonCloudinary(avatarLocalPath);

    // Step 4: Check upload success
    if (!avatar.url) {
        throw new ApiError(400, "Error uploading avatar");
    }

    // Step 5: Update avatar URL in database
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true } // Return updated user
    ).select("-password");

    // Step 6: Send success response
    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Avatar updated successfully"
        )
    );

});


/*----------------------------------------------------------
        Controller to Update Cover Image
----------------------------------------------------------*/

const updateUsercoverImage = asyncHandler(async (req, res) => {

    // Step 1: Get cover image path from Multer
    const coverImageLocalPath = req.file?.path;

    // Step 2: Check if file exists
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    // Step 3: Upload image to Cloudinary
    const coverImage = await uploadonCloudinary(coverImageLocalPath);

    // Step 4: Check upload success
    if (!coverImage.url) {
        throw new ApiError(400, "Error uploading cover image");
    }

    // Step 5: Update cover image URL in database
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true } // Return updated user
    ).select("-password");

    // Step 6: Send success response
    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Cover image updated successfully"
        )
    );

});

export {
    updateAccountDetails,
    updateUserAvatar,
    updateUsercoverImage
};
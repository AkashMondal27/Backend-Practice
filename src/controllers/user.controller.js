import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser =asyncHandler(async(req , res)=>{
    res.status(200).json({
        message : 'Open postman & check the response ./n Response successfully get '
    })
})

export {registerUser};
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser,logoutUser } from "../controllers/loginLogout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../controllers/loginLogout.controller.js";

const router=Router()

router.route("/register").post(

    /*Before calling the controller, Multer processes the uploaded files.
       upload.fields() allows uploading multiple files with different field names. */

    upload.fields([
       {
        name:"avatar",
        maxCount:1
       },
       {
        name:"coverImage",
        maxCount:1
       }
    ]),
    registerUser     // After the files are uploaded successfully,the request is passed to the register controller.
)



router.route("/login").post(loginUser)

//secure route

router.route("/logout").post(verifyJWT ,logoutUser)
router.route("/refresh-token"),post(refreshAccessToken)

export default router ;
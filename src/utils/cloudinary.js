import { v2 as cloudinary } from 'cloudinary'
// Import File System module to delete temporary files
import fs from "fs"
import path from "path"


// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload helper: resolve absolute path and log detailed errors
const uploadonCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) {
            console.error("uploadonCloudinary: no local file path provided")
            return null
        }

        const absolutePath = path.isAbsolute(localfilePath)
            ? localfilePath
            : path.resolve(localfilePath)

        console.log("uploadonCloudinary: uploading ->", absolutePath)

        const response = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "auto"   // Automatically detect the file type(video, image, pdf, etc)
        })

        // File uploaded successfully
        console.log("Cloudinary upload successful:", response && response.url)
        
        //remove local temporary files if exists 
        fs.unlinkSync(localfilePath)
        return response
    } catch (error) {
        // remove local temporary file if exists
        try {
            if (localfilePath && fs.existsSync(localfilePath)) {
                fs.unlinkSync(localfilePath)
            }
        } catch (e) {
            console.error("Failed to remove temp file:", e)
        }

        

        return null
    }
}


export { uploadonCloudinary }

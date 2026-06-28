import { v2 as cloudinary } from 'cloudinary'
// Import File System module to delete temporary files
import fs from "fs"


// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// Configure Cloudinary using environment variables
const uploadonCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath)
            return ("can not find the local file path ", null)

            // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"   // Automatically detect the file type(video, image, pdf, etc)
        })

         // File uploaded successfully
        console.log("File uploaded successfully.");
        console.log("Cloudinary URL: ", response.url);

         // Return Cloudinary response
        return response;


    } catch (error) {
        fs.unlinkSync(localfilePath) // remove the local saved temporary file as the upload operation got failed
         console.log("Cloudinary upload failed.");
        return null;
    }
}



export {uploadonCloudinary} ;
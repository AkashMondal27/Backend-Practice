// Multer is used to handle file uploads in Express.
import multer from "multer";


// Configure where and how uploaded files will be stored
const storage = multer.diskStorage({

    // Set the destination folder for uploaded files
  destination: function (req, file, cb) {    // Save uploaded files inside the "public/temp" folder
    cb(null, "./public/tem")
  },

   // Set the filename for the uploaded file
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)   //Save the file using its original name
  }
})

export const upload = multer({ storage: storage })

/*  file.originalname)  ==> Save the file using its original name 
// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) :-If you want unique filenames .

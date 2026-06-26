// this file help me to connect with databse 


// It is a Higher Order Function :- It takes an async request handler as input
const asyncHandler = (requestHandler) => {
    (req, res, next) => {   // return a new middleware funcation

        Promise.resolve(requestHandler(req, res, next))  // Promise.resolve() converts the returned value into a Promise
            .catch((err) => next(err))   // If any error occurs, pass it to Express error middleware
    }
}


export { asyncHandler }


/*.........................................................
         2nd process using try catch
............................................................

 const asyncHandler =(fn)=>{async(req,res,next)=>{
    try {
        await fn(req,res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message:error.message
        })
    }
}} 
    */
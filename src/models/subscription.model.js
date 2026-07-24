import mongoose ,{Schema}  from "mongoose";

const subscriptionSchema= new Schema({ // If you want to write new Schema() instead of new mongoose.Schema(), import Schema.
   subscriber : {
    type : Schema.Types.ObjectId, // ONE WHO IS SUBSRIBING 
    ref : "User"
   },
   channel : {
    type : Schema.Types.ObjectId, 
    ref : "User"
   },

}, {timestamps : true})

export const Subscription= mongoose.model("SubscriptionSchema", subscriptionSchema)
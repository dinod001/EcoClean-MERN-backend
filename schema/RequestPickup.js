import mongoose from "mongoose";

const requestPickupSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:"User",
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    },
    date:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    staff: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee"
        }
    ],
    status:{
        type: String,
        enum: ["Pending", "Completed", "Canceled","In Progress"],
        default: "Pending",
    }
},{timestamps:true})


const RequestPickup=mongoose.model("RequestPickup",requestPickupSchema)

export default RequestPickup;
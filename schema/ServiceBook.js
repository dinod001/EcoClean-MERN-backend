import mongoose from "mongoose";

const serviceBookSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:"User",
        required:true
    },
    serviceName:{
        type:String,
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
    date:{
        type:Date,
        required:true
    },
    advance:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    balance:{
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


const ServiceBook=mongoose.model("ServiceBook",serviceBookSchema)

export default ServiceBook;
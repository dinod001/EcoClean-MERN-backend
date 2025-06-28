import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum: ["General", "Alert", "Reward","Reminder","Discount"],
        default:'General'
    },
    status:{
        type:String,
        enum: ["Read", "Unread"],
        default:'Unread'
    }
},{timestamps:true})

const Notification=mongoose.model("Notification",notificationSchema)
export default Notification; 
import mongoose from 'mongoose'

const customerInquirySchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:'User',
        required:true,
    },
    subject:{
        type:String,
        reqired:true
    },
    message:{
        type:String,
        required:true
    },
    Repliedmessage:{
        type:String,
        default:null
    },
    category:{
        type:String,
        enum: ["General", "Complaint", "Suggestions"],
        default:'General'
    },
    status:{
        type:String,
        enum: ["Pending", "Replied"],
        default:'Pending'
    }
},{timestamps:true})

const CustomerInquiry=mongoose.model("CustomerInquiry",customerInquirySchema)
export default CustomerInquiry
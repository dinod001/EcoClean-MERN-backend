import mongoose from "mongoose";

const serviceSchema=new mongoose.Schema({
    serviceName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number
    },
    imageUrl:{
        type:String
    },
    Availability:{
        type:Boolean,
        required:true
    }
})

const Service=mongoose.model("Service",serviceSchema)

export default Service
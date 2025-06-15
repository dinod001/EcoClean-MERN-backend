import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const personnelSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:['Male','Female'],
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    birthDay:{
        type:Date,
        required:true
    },
    nic:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    adress:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    userName:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    }
})

personnelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

personnelSchema.methods.matchPassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

const Personnel=mongoose.model("Personnel",personnelSchema)
export default Personnel
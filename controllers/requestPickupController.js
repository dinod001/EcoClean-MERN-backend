import RequestPickup from "../schema/RequestPickup.js";
import { v2 as cloudinary } from "cloudinary";

// Add new pickup request
export const placeNewRequest = async (req, res) => {
  try {
    const { requestPickupData } = req.body;
    const imageFile = req.file;
    const userId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Image not attached" });
    }

    const parsedPickupData = JSON.parse(requestPickupData);
    parsedPickupData.userId = userId;

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedPickupData.imageUrl = imageUpload.secure_url;

    const newPickupRequest = await RequestPickup.create(parsedPickupData);

    res.status(201).json({ success: true, message: "Request Successfully", data: newPickupRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all request pickup
export const getALLpickup=async(req,res)=>{
    try {
        const userId=req.auth.userId;
        const allPickups=await RequestPickup.find({userId:userId})
        res.status(200).json({ success: true, allPickups });
    } catch (error) {
        res.status(400).json({ success: false,message:error.message });
    }
}

//get only specific pickup
export const getPickup=async(req,res)=>{
    try {
        const {id}=req.params;
        const PickupRequest=await RequestPickup.findById({_id:id})
        res.status(200).json({ success: true, PickupRequest });
    } catch (error) {
        res.status(400).json({ success: false,message:error.message });
    }
}

// PATCH - Update pickup request
export const updateRequest = async (req, res) => {
    try {
      const { requestPickupData} = req.body;
      const {requestId}=req.params;
      const imageFile = req.file;
      const userId = req.auth.userId;
  
      const parsedPickupData = JSON.parse(requestPickupData);
      parsedPickupData.userId = userId;
  
      // Optional: upload image if provided
      if (imageFile) {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedPickupData.imageUrl = imageUpload.secure_url;
      }
  
      const updatedRequest = await RequestPickup.findByIdAndUpdate(
        requestId,
        { $set: parsedPickupData },
        { new: true }
      );
  
      if (!updatedRequest) {
        return res.status(404).json({ success: false, message: "Request not found" });
      }
  
      res.status(200).json({ success: true, message: "Request updated", data: updatedRequest });
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  //delete a pickup request
  export const deleteRequest=async(req,res)=>{
    try {
        const {requestId}=req.params;
        const request=await RequestPickup.findByIdAndDelete(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
          }
          res.status(200).json({ success: true, message: "Pickup Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: true, message:error.message});
    }
  }
  

//personnel APIS

//get all request pickup
export const personnelGetALLpickup=async(req,res)=>{
    try {
        const allPickups=await RequestPickup.find()
        res.status(200).json({ success: true, allPickups });
    } catch (error) {
        res.status(400).json({ success: false,message:error.message });
    }
}

// PATCH - Update pickup request
export const personnelUpdateRequest = async (req, res) => {
    try {
      const { requestPickupData} = req.body;
      const {requestId}=req.params;
      const imageFile = req.file;
  
      const parsedPickupData = JSON.parse(requestPickupData);
  
      // Optional: upload image if provided
      if (imageFile) {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedPickupData.imageUrl = imageUpload.secure_url;
      }
  
      const updatedRequest = await RequestPickup.findByIdAndUpdate(
        requestId,
        { $set: parsedPickupData },
        { new: true }
      );
  
      if (!updatedRequest) {
        return res.status(404).json({ success: false, message: "Request not found" });
      }
  
      res.status(200).json({ success: true, message: "Request updated", data: updatedRequest });
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
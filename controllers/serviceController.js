import { v2 as cloudinary } from "cloudinary";
import Service from "../schema/Service.js";

//add new service
export const addService=async (req,res)=>{
    try {
        const { serviceData } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Image not attached" });
        }

        const parsedServiceData = JSON.parse(serviceData);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedServiceData.imageUrl = imageUpload.secure_url;

        const newPickupRequest = await Service.create(parsedServiceData);

        res.status(201).json({ success: true, message: "Service Added Sucessfully", data: newPickupRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//get only one service
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//get all services
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//update service
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const {updateData} = req.body;
        const imageFile = req.file;

        const parsedUpdateData = JSON.parse(updateData);

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path);
            parsedUpdateData.image = imageUpload.secure_url;
        }

        const updatedService = await Service.findByIdAndUpdate(id, parsedUpdateData, { new: true });

        if (!updatedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({ success: true, message: "Service updated successfully", data: updatedService });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//delete a service
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


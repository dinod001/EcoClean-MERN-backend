import ServiceBook from "../schema/ServiceBook.js"

//add new service
export const addServiceBook=async(req,res)=>{
    try {
        const {serviceBookData}=req.body;
        const newBooking=await ServiceBook.create(serviceBookData);
        res.status(201).json({ success: true, newBooking });
    } catch (error) {
        res.status(500).json({ success: false,message:error.message });
    }
}

//delete booking
export const deleteBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const request = await ServiceBook.findByIdAndDelete(id);
      if (!request) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      res.status(200).json({ success: true, message: "Service booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

//update booking
export const updateBooking=async(req,res)=>{
    try {
        const {serviceBookData}=req.body;
        const id=serviceBookData._id
        const upadtedBooking=await ServiceBook.findOneAndUpdate({ _id: id },serviceBookData,{ new: true, runValidators: true });
        res.status(200).json({ success: true, upadtedBooking });
    } catch (error) {
        res.status(500).json({ success: false,message:error.message });
    }
}

//get all booking
export const getAllBooking=async(req,res)=>{
    try {
        const id=req.auth.userId;
        const allBookings=await ServiceBook.find({userId:id})
        res.status(200).json({ success: true, allBookings });
    } catch (error) {
        res.status(500).json({ success: false,message:error.message });
    }
}

//get specific booking
export const getBooking=async(req,res)=>{
    try {
        const { id } = req.params;
        const booking=await ServiceBook.findById({_id:id})
        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false,message:error.message });
    }
}


//Personnel APIS


//get all booking
export const personnelGetAllBooking=async(req,res)=>{
    try {
        const allBookings=await ServiceBook.find()
        res.status(200).json({ success: true, allBookings });
    } catch (error) {
        res.status(500).json({ success: false,message:error.message });
    }
}
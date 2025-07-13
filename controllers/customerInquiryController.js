import CustomerInquiry from "../schema/CustomerInquiry.js";

//add new inquiry
export const addNewInquiry=async(req,res)=>{
    try {
        const userId=req.auth.userId;
        const {customerInquiry}=req.body;

        customerInquiry.userId=userId;
        const newInquiry=await CustomerInquiry.create(customerInquiry)
        res.status(201).json({ success: true, message: "sent Successfully", data: newInquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//delete inquiry
export const deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await CustomerInquiry.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }
        res.json({ success: true, message: "Inquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//get only sepecific inquiry
export const getInquiryById = async (req, res) => {
    try {
        const { id } = req.params;
        const inquiry = await CustomerInquiry.findById(id);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }
        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//get All inquires
export const getAllInquiries = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const inquiries = await CustomerInquiry.find({ userId });
        res.json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//update inquiries
export const updateInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const {UpdatedCustomerInquiry} = req.body;

        const updatedInquiry = await CustomerInquiry.findByIdAndUpdate(id, UpdatedCustomerInquiry, {
            new: true,
            runValidators: true
        });

        if (!updatedInquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }

        res.json({ success: true, message: "Inquiry updated successfully", data: updatedInquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//Personnel methods

//get All inqiuroes
export const getAllInquiriesByPersonnel = async (req, res) => {
    try {
        const inquiries = await CustomerInquiry.find({});
        res.json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const roleBaseAccessByAdmin=async(req,res,next)=>{
    if (!req.personnel || req.personnel.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
    next()
}

export const roleBaseAccessByStaff=async(req,res,next)=>{
    if (!req.personnel || req.personnel.role !== "Staff") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }
    next()
}


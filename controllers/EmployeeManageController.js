import Employee from "../schema/Employee.js";

//Add new employee
export const addEmployee = async (req, res) => {
    try {
        const employeeData = req.body;

        const newEmployee = await Employee.create(employeeData);

        res.status(201).json({ 
            success: true, 
            message: "Employee added successfully", 
            data: newEmployee 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

//Get employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//Get all employees
export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//Update employee
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.json({ 
            success: true, 
            message: "Employee updated successfully", 
            data: updatedEmployee 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//Delete employee
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

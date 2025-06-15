import Personnel from "../schema/Personnel.js"; // add `.js` if using ES modules and no bundler
import User from "../schema/Users.js";

//delete a user
export const deletePersonnel = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await Personnel.findByIdAndDelete(userId); //

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get only a specific user
export const getPersonnelById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Personnel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all logged user
export const getAllPersonnels = async (req, res) => {
  try {
    const users = await Personnel.find(); // You can filter or sort here if needed

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update personnel
export const updatePersonnel = async (req, res) => {
  try {
    const userId = req.params.id;
    const {updateData} = req.body;;

    // Prevent updating password directly here unless you handle hashing again
    if (updateData.password) {
      return res.status(400).json({
        success: false,
        message: "Password updates must be handled through a separate secure route.",
      });
    }

    const updatedUser = await Personnel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/*customer*/

//get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find(); // You can filter or sort here if needed

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get customer by id
export const getCustomerById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId); //

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



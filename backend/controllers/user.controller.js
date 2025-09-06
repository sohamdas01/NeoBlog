
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const updateUser=async (req, res) => {

    if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
    if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res.status(400).json({
        message: "Username must be between 7 and 20 characters"
      });
    }
     
      if (req.body.username.includes(' ')) {
      return res.status(400).json({
        message: "Username cannot contain spaces"
      });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return res.status(400).json({
        message: "Username must be lowercase"
      });
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return res.status(400).json({
        message: "Username can only contain letters and numbers"
      });
    }
    }

      if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  try {
    const updatedUser=await User.findByIdAndUpdate(
       req.params.userId,
  
      { $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      } },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating user",
      error
    });
  }
}

export const deleteUser=async (req, res) => {
  if (! req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting user",
      error
    });
  }
}

export const logoutUser=async(req,res)=>{
  try {
    res.clearCookie("token")
    .status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out",
      error
    });
  }
}

export const getUser = async (req, res) => {
  if(!req.user.isAdmin){
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const startIndex=parseInt(req.query.startIndex) || 0;
    const limit=parseInt(req.query.limit) || 8;
    const sortDirection=req.query.direction === "desc" ? -1 : 1;
    const users=await User.find().sort({ createdAt: sortDirection })
    .skip(startIndex).limit(limit);

    const userWithoutPassword = users.map((users)=>{
      const { password, ...rest } = users._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now=new Date();
    const oneMonthAgo=new Date(now.getFullYear(), now.getMonth()-1, now.getDate());

    const lastMonth=await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    return res.status(200).json({
      message: "Users fetched successfully",
      users: userWithoutPassword,
       totalUsers,
      lastMonth
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users",
      error
    });
  }
}

import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import imagekit from "../utills/imagekit.js";
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
   const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email=== "" || password === "") {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }


    // Here  generate a token and send it back to the client
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
  //remove password from user object before sending it back
    const loggedInUser = await User.findById(user._id).select("-password");

    res.status(200).cookie("token", token, { httpOnly: true }).json({
      message: "Login successful",
      user: loggedInUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
}

export const GoogleLogin = async (req, res) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user=await User.findOne({ email });
    if (user) {
      // User already exists, generate token and return user data
      const token = jwt.sign({ id: user._id ,isAdmin: user.isAdmin }, process.env.JWT_SECRET);


      const loggedInUser = await User.findById(user._id).select("-password");

      return res.status(200).cookie("token", token, { httpOnly: true }).json({
        message: "Login successful",
        user: loggedInUser,
      });
    }else{
      const generatePassword= Math.random().toString(36).slice(-8);  // Generate a random password
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({ username:name.toLowerCase().split(" ").join("")+Math.random().toString(9).slice(-5), email, password: hashedPassword, profilePicture: googlePhotoUrl });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id,isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
      const loggedInUser = await User.findById(newUser._id).select("-password");
      return res.status(201).cookie("token", token, { httpOnly: true }).json({
        message: "User created successfully",
        user: loggedInUser,
      }); 
    }
  } catch (error) {
    res.status(500).json({ message: "Error during Google login", error });
  }
};




// Update user profile picture
export const updateProfilePicture = async (req, res) => {
  try {
    // Check if a file was uploaded
      if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fs.readFileSync(req.file.path), // Buffer of the file
      fileName: `${req.user.id}-${Date.now()}-${req.file.originalname}`, // Unique filename
      folder: "/profile_pictures", // Optional: specify folder in ImageKit
    });

    // Remove file from local storage after uploading to ImageKit
    fs.unlinkSync(req.file.path);

    // Update user profile picture in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profilePicture: uploadResponse.url },
      { new: true } // Return updated document
    ).select("-password");

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({
      message: "Error updating profile picture",
      error: error.message,
    });
  }
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/userModel");
const setTokenCookie = require("../../authService/setTokenCookie");
const { createToken } = require("../../authService/authService");
const clearTokenCookie = require("../../authService/clearCookie");
const { sendResetPassword } = require("../../emailService/userAuthEmail");


const signup = async (req, res) => {
  const { fullName,email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }
  const profilePhoto = req.file ? req.file.path : null;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists. Please log in." });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      fullName,
      email,
      password: hashedPassword,
      profilePhoto,
    };

    const newUser = await User.create(newUserData);

    return res.status(201).json({
      msg: "Signup successful, Please Login",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Internal server error from user signup: ${error}`,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (user.status !== "active") {
      return res.status(403).json({ msg: `Account is ${user.status}` });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ msg: "Password not matched" });
    }

    const token = createToken(user);
    setTokenCookie(res, token);

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({ msg: `Server error: ${error}` });
  }
};

const handleLogout = (req, res) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: `Server error: ${error}` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const emailSent = await sendResetPassword(
      user.fullName,
      user.email,
      resetLink
    );

    if (!emailSent) {
      return res.status(500).json({ msg: "Failed to send reset email" });
    }

    return res.status(200).json({
      resetLink,
      msg: "Reset link sent to your email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: `Server error from forgot password: ${error.message}`,
    });
  }
};

const handleResetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    if (!resetToken) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Server error from handleResetPassword: ${error}` });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({
      user,
      
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ msg: "Server error fetching profile" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { fullName, phone } = req.body;
    const profilePhoto = req.file ? req.file.path : undefined;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (profilePhoto) updateData.profilePhoto = profilePhoto;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ msg: "Server error while updating profile" });
  }
};

module.exports = {
  signup,
  login,
  handleLogout,
  forgotPassword,
  handleResetPassword,
  getUserProfile,
  updateUserProfile,
};

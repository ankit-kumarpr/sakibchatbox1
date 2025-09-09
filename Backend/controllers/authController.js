const User = require("../models/User");
const generate6DigitId = require("../utils/generateId");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const loginIdTemplate = require("../utils/templates/loginIdTemplate");

const register = async (req, res) => {
  try {
    const { name, email } = req.body;

    console.log("Created by:", req.user.id);
    const creator = await User.findById(req.user.id);
    if (!creator) return res.status(400).json({ error: "Invalid creator" });

    let role = "";
    if (creator.role === "superadmin") role = "admin";
    else if (creator.role === "admin") role = "user";
    else return res.status(403).json({ error: "Permission denied" });

    const specialId = generate6DigitId();

    const newUser = new User({
      name,
      email,
      role,
      specialId,
      createdBy: creator._id,
    });

    await newUser.save();

    // Send email with specialId
    const html = loginIdTemplate(name, specialId);
    await sendEmail(email, "Your Gnet Login ID", html);

    res.status(201).json({
      message: `${role} created successfully`,
      user: newUser,
      specialId: newUser.specialId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { specialId } = req.body;
    const user = await User.findOne({ specialId });

    if (!user) return res.status(400).json({ error: "Invalid ID" });

    const now = new Date();
    const lastLogin = user.lastLogin || new Date(0);

    user.lastLogin = now;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "your_secret_key", // Replace with .env
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

// recreate the special id if any one forget admin create user, admin create by superadmin

const resetSpecialId = async (req, res) => {
  try {
    const { targetUserId } = req.body; // _id of the user whose ID is being reset
    const requester = await User.findById(req.user.id); // from JWT

    const target = await User.findById(targetUserId);
    if (!target)
      return res.status(404).json({ error: "Target user not found" });

    // Only allow reset if the requester is creator of target
    if (target.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to reset this ID" });
    }

    // Generate and update specialId
    target.specialId = generate6DigitId();
    await target.save();

    res.json({
      message: "Special ID reset successfully",
      newSpecialId: target.specialId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset special ID" });
  }
};

// get admin list

const GetallAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error });
  }
};

// get all users

const getallusers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// get profile

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // exclude __v field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
  resetSpecialId,
  GetallAdmins,
  getallusers,
  profile,
};

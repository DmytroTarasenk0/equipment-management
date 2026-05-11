const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const NodeCache = require("node-cache");
const { User } = require("../models");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 60 }); // 60 sec

// get all
router.get("/", verifyToken, async (req, res) => {
  try {
    // check cache
    const cachedUsers = cache.get("all_users");
    if (cachedUsers) {
      return res.json({ source: "cache", data: cachedUsers });
    }

    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // no password for output
    });

    cache.set("all_users", users);

    res.json({ source: "database", data: users });
  } catch (error) {
    res.status(500).json({ message: "Error getting users." });
  }
});

// get one user by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found." });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
});

// add a new user
router.post(
  "/",
  verifyToken,
  [
    // validation
    body("name")
      .isLength({ min: 2 })
      .withMessage("The username must be at least 2 characters long"),
    body("email").isEmail().withMessage("Wrong Email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("The password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "All required fields must be completed" });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser)
        return res.status(400).json({ message: "Email is already in use" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "Medic",
      });

      // delete cache since data change
      cache.del("all_users");

      res.status(201).json({ message: "User created", userId: newUser.id });
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  },
);

// update user password
router.put("/:id/password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // check the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "The new password must be at least 6 characters long",
      });
    }

    // hash and save the new one
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedNewPassword },
      { where: { id: req.params.id } },
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password" });
  }
});

// delete a user
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });

    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;

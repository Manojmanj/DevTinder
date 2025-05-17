const express = require("express");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      console.log("hi");
      throw new Error("Invalid edit request");
    }

    loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} your profile was updated  successfully !!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send("Both old and new passwords are required.");
    }

    const user = req.user;

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send("Old password is incorrect.");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send(`${user.firstName}, your password has been updated successfully.`);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.post("/profile/forgot-password", async (req, res) => {
  try {
    const { emailId, newPassword } = req.body;
    if (!emailId || !newPassword) {
      return res.status(400).send("Email and new password are required.");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not found");
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();
    res.send(`${user.firstName} , your password updated successfully`);
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

module.exports = profileRouter;

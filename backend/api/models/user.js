import mongoose from "mongoose";
import { GENDER } from "../../config/constants.js";
import model from "../../config/model.js";

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true, enum: [GENDER.MALE, GENDER.FEMALE] },
  profilePic: { type: String },
  accessToken: { type: String},
  refreshToken: { type: String},
  phoneNumber: { type: String},
  countryCode: { type: String},
  forgotPwdToken: { type: String},
  forgotPwdTokenExpiry: { type: Number},
  inviteToken: { type: String},
  inviteTokenExpiry: { type: Number},
  isVerified: { type: Boolean, default: false },
	...model
});

const User = mongoose.model("User", userSchema);

export default User;

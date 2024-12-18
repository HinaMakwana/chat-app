import { error } from "console";
import {
  GENDER,
  HTTP_STATUS_CODE,
  TOKEN_EXPIRY,
} from "../../config/constants.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../helpers/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastname,
      username,
      email,
      password,
      gender,
      profilePic,
    } = req.body;

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const findUser = await User.findOne({ email: email, isDeleted: false });

    if (findUser) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: "",
        data: {},
        error: "User already exists",
      });
    }

    const findUserName = await User.findOne({
      username: username,
      isDeleted: false,
    });

    if (findUserName) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: "",
        data: {},
        error: "Username already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: firstName,
      lastname: lastname,
      username: username,
      email: email,
      password: hashPassword,
      gender: gender,
      profilePic: gender === GENDER.MALE ? boyProfilePic : girlProfilePic,
    });

    await User.create(newUser);

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "User created successfully",
      data: newUser,
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      message: "Server error",
      data: {},
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({
      email: email,
      isDeleted: false,
    }).select('_id firstName username email password profilePic');

    if (!findUser) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        status: HTTP_STATUS_CODE.NOT_FOUND,
        message: "",
        data: {},
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_STATUS_CODE.BAD_REQUEST,
        message: "",
        data: {},
        error: "Invalid credentials",
      });
    }

    const payload = {
      id: findUser._id,
      email: findUser.email,
      username: findUser.username,
    };

    const accessToken = await generateToken(payload, TOKEN_EXPIRY.ACCESS_TOKEN);
    const refreshToken = await generateToken(
      payload,
      TOKEN_EXPIRY.REFRESH_TOKEN
    );

    await User.updateOne(
      { _id: findUser._id, isDeleted: false },
      {
        $set: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          updatedAt: Date.now(),
          updatedBy: findUser._id,
        },
      }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "User logged in successfully",
      data: {
        findUser,
        token: {
          accessToken,
          refreshToken,
        },
      },
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      message: "Server error",
      data: {},
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { _id: id } = req.me;

    await User.updateOne(
      { _id: id, isDeleted: false },
      {
        $set: {
          accessToken: null,
          refreshToken: null,
          updatedAt: Date.now(),
          updatedBy: id,
        },
      }
    );

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "User logged out successfully",
      data: {},
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      message: "Server error",
      data: {},
      error: error.message,
    });
  }
};

import { HTTP_STATUS_CODE } from "../../config/constants.js"
import User from "../models/user.js";


export const getUsers = async (req,res) => {
	try {
		// const userId = req.me._id;

		const findUsers = await User.find({
			 _id: { $ne: req.me._id }
		}).select("-password");

		return res.status(HTTP_STATUS_CODE.OK).json({
			status: HTTP_STATUS_CODE.OK,
			data: findUsers,
			error: ''
		})
	} catch (error) {
		return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
			status: HTTP_STATUS_CODE.SERVER_ERROR,
			data: {},
			error: error.message
		})
	}
}
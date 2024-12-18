import { HTTP_STATUS_CODE } from "../../config/constants.js"
import User from "../models/user.js";


export const getUsers = async (req,res) => {
	try {
		// const userId = req.me._id;

		const findUsers = await User.find({
			// _id: { $ne: userId }
		}).select("-password");

		return res.status(HTTP_STATUS_CODE.OK).json({
			status: HTTP_STATUS_CODE.OK,
			data: findUsers,
			error: null
		})
	} catch (error) {
		return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
			status: HTTP_STATUS_CODE.SERVER_ERROR,
			data: {},
			error: error.message
		})
	}
}
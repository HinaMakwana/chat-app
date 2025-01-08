import { FILE_CONSTANTS, HTTP_STATUS_CODE } from "../../config/constants.js";
import { fileValidation } from "../utils/fileValidation.js";

export const uploadFile = async (req, res) => {
  try {
    let files = req.files;

    /* call file validation and upload it in storage helper function with necessary informations
        like new file path or folder structure, uploaded file data, valid content types's array and errorcode,
        max file size value and errorcode, current user's id */
    const fileUpload = await fileValidation(
      FILE_CONSTANTS.UPLOAD.PATH + FILE_CONSTANTS.ATTACHMENT.PATH,
      files,
      FILE_CONSTANTS.ATTACHMENT.CONTENT_TYPES,
      "Only .png, .jpg and .jpeg files are allowed.",
      FILE_CONSTANTS.ATTACHMENT.SIZE,
      "The file size should not be greater than 100mb.",
      req.me.id,
      req.body.compress || false
    );

    //if there is an error then send validation response
    if (fileUpload.isError) {
      //return response
      return res
        .status(
          fileUpload.isServerError
            ? HTTP_STATUS_CODE.SERVER_ERROR
            : HTTP_STATUS_CODE.BAD_REQUEST
        )
        .json({
          status: fileUpload.isServerError
            ? HTTP_STATUS_CODE.SERVER_ERROR
            : HTTP_STATUS_CODE.BAD_REQUEST,
          errorCode: "",
          message: fileUpload.isServerError ? "" : fileUpload.data,
          data: "",
          error: fileUpload.isServerError ? fileUpload.data : "",
        });
    }

    //return success response
    return res.status(HTTP_STATUS_CODE.OK).json({
      status: HTTP_STATUS_CODE.OK,
      message: "Attachments uploaded successfully",
      data: fileUpload.data,
      error: "",
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      data: {},
      error: error.message,
    });
  }
};

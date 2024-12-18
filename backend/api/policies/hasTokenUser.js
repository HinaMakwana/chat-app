import { HTTP_STATUS_CODE } from "../../config/constants.js";
import User from "../models/user.js";
import JWT from "jsonwebtoken";

const hasTokenUser = async (req, res, proceed) => {
  try {
    /* This allows the policy to determine which route is being accessed and perform the
   necessary checks and validations based on the route. */
    let url = req.route.path;

    //getting authToken from headers
    let authToken = req.headers["authorization"];

    //check if authToken starts with Bearer, fetch the token or return error
    if (authToken && authToken.startsWith("Bearer ")) {
      //if token start with Bearer
      authToken = authToken.split(" ")[1];
    } else {
      //if token is not provided then send validation response
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "AUTH004",
        message: "token not found",
        data: "",
        error: "",
      });
    }

    //verify jwt token based on jwt key
    let decodedToken = await JWT.verify(authToken, process.env.JWT_KEY);

    //check for decodedToken expiry
    if (
      decodedToken &&
      decodedToken.exp &&
      decodedToken.exp > Math.floor(Date.now() / 1000)
    ) {
      if (decodedToken.id) {
        //finds user in database by id got from token
        let user = await User.findOne({
          _id: decodedToken.id,
          isDeleted: false,
          isActive: true,
        });

        if (user) {
          /* checks token from header with current token stored in database for that user
          if that doesn't matches then send validation response */
          if (user.accessToken !== authToken) {
            return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
              status: HTTP_STATUS_CODE.UNAUTHORIZED,
              errorCode: "AUTH003",
              message: "token mismatched",
              data: "",
              error: "",
            });
          }

          req.me = user;
          return proceed();

          // req.me = user;
          // return proceed();
        } else {
          //if user is not found in database then send validation response
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
            status: HTTP_STATUS_CODE.UNAUTHORIZED,
            errorCode: "ERR404",
            message: "invalid user",
            data: "",
            error: "",
          });
        }
      } else {
        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
          status: HTTP_STATUS_CODE.UNAUTHORIZED,
          errorCode: "ERR404",
          message: "invalid user",
          data: "",
          error: "",
        });
      }
    }
  } catch (error) {
    //if error is of jwt token expire then send validation response with errorcode 'AUTH004'
    if (error instanceof JWT.TokenExpiredError) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        errorCode: "AUTH004",
        message: "token expired",
        data: "",
        error: "",
      });
    } else {
      //send server error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        errorCode: "ERR500",
        message: "",
        data: "",
        error: error.message,
      });
    }
  }
};

export default hasTokenUser;

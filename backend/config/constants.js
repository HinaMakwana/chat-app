export const GENDER = {
  MALE: "male",
  FEMALE: "female",
};

export const VALIDATION_RULE = {};

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '8h',
  REFRESH_TOKEN: '1d',
  FORGOT_PASSWORD_TOKEN: 5 * 60, // 5 minutes
  INVITE_TOKEN: 48 * 60 * 60, //48 hours
};

export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};
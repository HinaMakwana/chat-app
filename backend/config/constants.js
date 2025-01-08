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

import dotenv from "dotenv";
dotenv.config();

export const FILE_CONSTANTS = {
  TYPES: {
    IMAGE: {
      FLAG: 'I',
      CONTENT_TYPES: ['image/png', 'image/jpg', 'image/jpeg'],
    },
    VIDEO: {
      FLAG: 'V',
      CONTENT_TYPES: ['video/quicktime', 'video/x-ms-wmv', 'video/mp4'],
    },
    PDF: {
      FLAG: 'P',
      CONTENT_TYPES: ['application/pdf'],
    },
    EXCEL: {
      FLAG: 'E',
      CONTENT_TYPES: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
    },
  },
  UPLOAD: {
    PATH: 'uploads/',
  },
  LOGO: {
    PATH: 'logo/',
    SIZE: 5 * 1024 * 1024,
    CONTENT_TYPES: ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'],
  },
  ATTACHMENT: {
    PATH: 'attachment/',
    SIZE: 100 * 1024 * 1024,
    CONTENT_TYPES: ['image/png', 'image/jpg', 'image/jpeg'],
  },
  MAX_SIZE: 1 * 1024 * 1024 * 1024, // 1 GB file size limit
};

export const DRIVERS = {
  STORAGE: {
    AWS_S3: 's3',
    FILE_SYSTEM: 'fs',
  },
  QUEUE: {
    SQS: 'sqs',
    DATABASE: 'database',
  },
  STORAGE_ACTIONS: {
    UPLOAD_FILE: 'uploadFile',
    DELETE_FILE: 'deleteFile',
    DOWNLOAD_FILE: 'downloadFile',
  },
  QUEUE_ACTIONS: {
    SEND_MSG: 'sendMsg',
    RECEIVE_MSGS: 'receiveMsgs',
    DELETE_MSG: 'deleteMsg',
  },
};

export const STATUS = {
  MEDIA: {
    UPLOADED: 'uploaded',
    FAIL: 'failed',
    ATTACHED: 'attached',
  },
  SERVICE: {
    PENDING: 'pending',
    IN_PROGRESS: 'in progress',
    PAYMENT_PENDING: 'payment pending',
    COMPLETED: 'completed',
  },
};
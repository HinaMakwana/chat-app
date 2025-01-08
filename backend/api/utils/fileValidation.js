import { v4 as UUID} from 'uuid';
import {storageCore} from '../helpers/storage/core/core.js';
import { DRIVERS, FILE_CONSTANTS, STATUS } from '../../config/constants.js';
import Media from '../models/Media.js';
import { imageCompression } from './imageCompression.js';
import * as FS from 'fs';
import { create } from 'domain';

export const fileValidation = async (
  path,
  files,
  allowedTypes,
  allowedTypesMessage,
  sizeLimit,
  sizeLimitMessage,
  createdBy,
  compress = false
) => {
  try {
    let sizeArray = [];

    //push the media sizes to the size array and gets array of mimeTypes
    let contentType = files.map((item) => {
      sizeArray.push(item.size);
      return item.mimetype;
    });

    //checks for any different content types
    let notPresent = contentType.filter((e) => !allowedTypes.includes(e));

    //if file format is not valid
    // if (notPresent.length > 0) {
    //   for (let item of files) {
    //     FS.unlink(item.path, (err) => {
    //       if (err) {
    //         throw err;
    //       }
    //     });
    //   }

    //   return {
    //     isError: true,
    //     data: allowedTypesMessage,
    //   };
    // }

    //size validation function
    const isAboveSize = (currentValue) => currentValue > sizeLimit;

    //check for the file size limit
    let isFileSizeReached = sizeArray.some(isAboveSize);

    if (isFileSizeReached === true) {
      for (let item of files) {
        FS.unlink(item.path, (err) => {
          if (err) {
            throw err;
          }
        });
      }
      return {
        isError: true,
        data: sizeLimitMessage,
      };
    }

    let uploadedFile = [];

    //loops through files
    for (let item of files) {
      let convertedSize = item.size;

      //sets media type value
      let mediaType = FILE_CONSTANTS.TYPES.IMAGE.FLAG;
      if (FILE_CONSTANTS.TYPES.PDF.CONTENT_TYPES.includes(item.mimetype)) {
        mediaType = FILE_CONSTANTS.TYPES.PDF.FLAG;
      }

      //gets the file name
      let fileName = item.path.substring(item.path.lastIndexOf('/') + 1);

      //if compress is true then only compress image

      if (compress) {
        let sourcePath = item.path;

        //convert file name and path for webp conversation
        item.path = `${sourcePath.slice(0, sourcePath.lastIndexOf('.'))}.webp`;
        fileName = `${fileName.slice(0, fileName.lastIndexOf('.'))}.webp`;

        //call helper to convert image to webp format
        let convertedImage = await imageCompression(sourcePath, item.path);

        if (convertedImage.isError) {
          return {
            isError: true,
            data: convertedImage.data,
          };
        }
        convertedSize = convertedImage?.data?.size;
      }

      // Upload file to storage
      let fileUpload = await storageCore(DRIVERS.STORAGE_ACTIONS.UPLOAD_FILE, {
        sourceFilePath: item.path,
        destinationFilePath:
          process.env.STORAGE_DRIVER &&
          process.env.STORAGE_DRIVER === DRIVERS.STORAGE.FILE_SYSTEM
            ? 'public/' + path
            : process.env.MOUNT_UPLOAD_BASE_PATH + path,
        fileName,
        destinationDir: path,
        contentType: item.mimetype,
      });

      if (fileUpload.isError) {
        return {
          isError: true,
          data: fileUpload.data,
        };
      }

      let createMediaObject = {
        // id: UUID(),
        fileName,
        url: fileUpload.data.url || fileUpload.data.Location,
        key: fileUpload.data.key,
        status: STATUS.MEDIA.UPLOADED,
        size: item.size,
        mediaType,
        contentType: item.mimetype,
        originalName: item.originalname,
        createdBy,
        convertedSize,
        isConverted: compress,
      };

      // Create media record
      const mediaData = await Media.create(createMediaObject);
      createMediaObject._id = mediaData._id;

      uploadedFile = [...uploadedFile, createMediaObject];
    }

    return {
      isError: false,
      data: uploadedFile,
    };
  } catch (err) {
    console.log('error in upload file s3 helper', err);
    // delete file from local
    for (let item of files) {
      FS.unlink(item.path, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    return {
      isError: true,
      isServerError: true,
      data: err.message,
    };
  }
};

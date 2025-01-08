import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import { promisify } from 'util';
const unlink = promisify(fs.unlink);

export const uploadFile = async ({ sourceFilePath }) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    const uploadResult = await cloudinary.uploader
      .upload(sourceFilePath,{resource_type: 'auto'})
      .catch((error) => {
        console.log(error);
      });
    await unlink(sourceFilePath);
      
    return {
      isError: false,
      data: { url: uploadResult['url'], key: uploadResult['public_id'] },
    };
  } catch (err) {
    console.log('error in upload file helper', err);
    // Delete the source file

    return { isError: true, data: err.message };
  }
};
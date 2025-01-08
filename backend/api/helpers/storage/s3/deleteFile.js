import { v2 as cloudinary } from 'cloudinary';

export const deleteFile = async function ({ sourceFilePath }) {
  try {
		cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    const result = await cloudinary.uploader.destroy(sourceFilePath);
    console.log('Delete result:', result);
    return { isError: false, data: true };
  } catch (error) {
    console.log('error in delete file helper', error);
    return { isError: true, data: error.message };
  }
};

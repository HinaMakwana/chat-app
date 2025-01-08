import * as FS from 'fs'
import * as SHARP from 'sharp'

export const imageCompression = async (sourcePath, destinationPath) => {
  try {
    /**
     * The function `convertToWebP` converts an image to the WebP format using the Sharp library in
     * JavaScript.
     * @returns the error object if there is an error, otherwise it does not return anything.
     */
    async function convertToWebP() {
      try {
        //convert iamge to webp format
        let convertedImage = await SHARP(sourcePath)
          .webp({ quality: 70 })
          .toFile(`${destinationPath}`);

        FS.unlink(sourcePath, (err) => {
          if (err) {
            console.log('err: ', err);
            throw err;
          }
        });

        return convertedImage;
      } catch (error) {
        return { isError: true, data: err.message };
      }
    }

    //call image convert function
    const convertedImage = await convertToWebP();

    return { isError: false, data: convertedImage };
  } catch (err) {
    return { isError: true, data: err.message };
  }
};

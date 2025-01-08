const { FS } = require('../../../../config/constants');

export const deleteFile = async function ({ sourceFilePath }) {
  try {
    FS.unlinkSync(sourceFilePath);
    return { isError: false, data: true };
  } catch (error) {
    console.log('error in delete file helper', error);
    return { isError: true, data: error.message };
  }
};


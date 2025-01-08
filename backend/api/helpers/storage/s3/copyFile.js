const { S3 } = require('../../../../config/constants');

export const copyFile = async ({ sourceKey, destinationKey }) => {
  try {
    // upload file to S3
    const fileParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      CopySource: `/${process.env.AWS_S3_BUCKET}/${sourceKey}`,
      Key: destinationKey,
      ACL: 'public-read',
    };

    let data = await S3.copyObject(fileParams).promise();

    return { isError: false, data };
  } catch (err) {
    console.log('error in copy file s3 helper', err);

    return { isError: true, data: err.message };
  }
};


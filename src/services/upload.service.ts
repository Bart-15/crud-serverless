import AWS from 'aws-sdk';
import { s3 } from '../db/config';
import config from '../config/config';
import { HttpError } from '../middleware/errHandle';

export type TImageUpload = {
  file: string;
};

const generatePresignedURL = async (imgName: string) => {
  let params = {
    Bucket: config.FILE_UPLOAD_BUCKET as string,
    Key: `${imgName}`, //filename
    Expires: 30 * 60, //time to expire in seconds (5 minutes)
  };

  return s3.getSignedUrl('putObject', params);
}

export async function uploadImage(
  parsedBody: TImageUpload
) {
  const base64File = parsedBody.file;

  if(!base64File) throw new HttpError(400, { error: 'Base64 image is required.' });

  const decodedFile: Buffer = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  let imageName = `images/${new Date().toISOString()}.jpeg`;
  const params: AWS.S3.PutObjectRequest = {
    Bucket: config.FILE_UPLOAD_BUCKET as string,
    Key: imageName,
    Body: decodedFile,
    ContentType: 'image/jpeg',
  };

  const res = await s3.upload(params).promise();
  const presignedUrl = await generatePresignedURL(imageName);

  return { res, presignedUrl };
}

import AWS from 'aws-sdk';
import { s3 } from '../db/config';
import config from '../config/config';
import { HttpError } from '../middleware/errHandle';

export type TImageUpload = {
  file: string;
};

export async function uploadImage(
  parsedBody: TImageUpload
): Promise<AWS.S3.ManagedUpload.SendData> {
  const base64File = parsedBody.file;

  if(!base64File) throw new HttpError(400, { error: 'Base64 image is required.' });

  const decodedFile: Buffer = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  const params: AWS.S3.PutObjectRequest = {
    Bucket: config.FILE_UPLOAD_BUCKET as string,
    Key: `images/${new Date().toISOString()}.jpeg`,
    Body: decodedFile,
    ContentType: 'image/jpeg',
  };

  const res = await s3.upload(params).promise();

  return res;
}

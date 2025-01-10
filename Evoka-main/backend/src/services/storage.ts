import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'your-region' });

export const uploadFile = async (bucketName: string, key: string, body: any) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
  });

  await s3.send(command);
  console.log(`File uploaded to ${bucketName}/${key}`);
};

export const downloadFile = async (bucketName: string, key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response = await s3.send(command);
  return response.Body;
};

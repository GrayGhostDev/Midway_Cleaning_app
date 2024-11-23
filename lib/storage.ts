import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToStorage(
  filename: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const key = `reports/${Date.now()}-${filename}`;
  
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: contentType,
    })
  );
  
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const region = process.env.AWS_REGION || "ap-south-1";
const bucketName = process.env.AWS_BUCKET_NAME || "ausc";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const uploadBlogImageToS3 = async (fileBuffer, originalName, mimeType) => {
  const sanitizedBase = path.basename(originalName, path.extname(originalName))
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext = path.extname(originalName) || ".jpg";
  const uniqueKey = `blogs/${sanitizedBase}_${Date.now()}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      Body: fileBuffer,
      ContentType: mimeType || "application/octet-stream",
    })
  );

  return `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueKey}`;
};

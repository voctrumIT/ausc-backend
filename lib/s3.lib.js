import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ap-south-1";
const bucketName = process.env.AWS_BUCKET_NAME || "ausc";

const accessKeyId =
  process.env.AWS_ACCESS_KEY_ID ||
  process.env.AWS_ACCESS_KEY ||
  process.env.S3_ACCESS_KEY;

const secretAccessKey =
  process.env.AWS_SECRET_ACCESS_KEY ||
  process.env.AWS_SECRET_KEY ||
  process.env.S3_SECRET_KEY;

const sessionToken =
  process.env.AWS_SESSION_TOKEN ||
  process.env.AWS_SECURITY_TOKEN;

const s3Config = {
  region,
};

// Only attach explicit credentials object if keys actually exist,
// preventing 'Resolved credential object is not valid' error when undefined
if (accessKeyId && secretAccessKey) {
  s3Config.credentials = {
    accessKeyId,
    secretAccessKey,
    ...(sessionToken ? { sessionToken } : {}),
  };
}

export const s3 = new S3Client(s3Config);

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

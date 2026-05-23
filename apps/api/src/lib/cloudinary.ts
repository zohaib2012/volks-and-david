import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloud(buffer: Buffer, originalname: string): Promise<string> {
  const ext = originalname.split(".").pop()?.toLowerCase() || "";
  const resourceType = ext === "pdf" ? "raw" : "image";
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const uploadOptions = {
    folder: "volks-and-david",
    resource_type: resourceType as "raw" | "image" | "auto" | "video",
    type: "upload" as const,
    access_mode: "public" as const,
    ...(resourceType === "raw"
      ? { public_id: `${uniqueId}.${ext}` }
      : { unique_filename: true }),
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (err, result) => {
        if (err) reject(err);
        else resolve(result!.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

export const cloudUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("application/")
    )
      cb(null, true);
    else cb(new Error("Only images and PDFs are allowed"));
  },
});

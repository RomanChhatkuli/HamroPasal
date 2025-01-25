import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadImage = async (image, folder,imageName) => {
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `HamroPasal/${folder}`,
          public_id: imageName || undefined, // Set custom image name here
          overwrite: true,
          invalidate: true
        },
        (error, result) => {
          if (error) {
            return reject(error); // Reject the Promise on error
          }
          resolve(result); // Resolve the Promise with the result
        }
      )
      .end(buffer); // Pass the buffer to the upload stream
  });
};

export default uploadImage;

if(process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const cloudinary = require('cloudinary')

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

function uploadImage(type, buffer, image_folder, image_name) {
  const image = `data:${type};base64,${buffer}`
  return cloudinary.v2.uploader.upload(image, {
    folder: `Oxo/${image_folder}`,
    public_id: image_name
  })
}

module.exports = {
  uploadImage
}
const { serverUrl } = require("./temp");
const fs = require("fs");
const path = require("path");

module.exports = {
    getResourceUploadUrl: (imageName) => {
        const baseUrl = `${serverUrl}uploads/resourceMedia/`;

        // Extract filename only (remove any incorrect folder structure)
        const fileName = path.basename(imageName);

        return `${baseUrl}${fileName}`;
    },
    getBase64Image: (imageName) => {
        const imagePath = `uploads/resourceMedia/${imageName}`;
        try {
            const extension = imageName.split(".")[1]
            const imageData = fs.readFileSync(imagePath);
            const base64Image = Buffer.from(imageData).toString('base64');
            return `data:image/${extension};base64,${base64Image}`;

        } catch (error) {
            console.error("Error reading image file:", error);
            return null;
        }
    }
}
const path = require('path');
const fs = require('fs');

function normalizePath(winPath) {
    return winPath.split(path.sep).join(path.posix.sep);
}

function deleteImages(basePath, images) {
    const imageArray = images.split(',');

    for (const image of imageArray) {
        const fullPath = path.join(basePath, image);
        try {
            // Check if the file exists before deleting
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath); // Delete the image file
                console.log(`Deleted: ${fullPath}`);
            }

            // Construct the folder path
            const folder = normalizePath(image).split('/')[0];
            const folderPath = path.join(basePath, folder);

            // Delete the parent folder if it's empty
            if (fs.existsSync(folderPath) && fs.readdirSync(folderPath).length === 0) {
                fs.rmdirSync(folderPath);
                console.log(`Deleted empty folder: ${folderPath}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return true; // Indicate successful deletion
}

module.exports = deleteImages;

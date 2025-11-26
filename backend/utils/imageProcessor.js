const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { thumbnailDir } = require('../config/upload');

// 生成缩略图
const generateThumbnail = async (imagePath, thumbnailSize = 300) => {
  try {
    const fileName = path.basename(imagePath);
    const thumbnailPath = path.join(thumbnailDir, `thumb_${fileName}`);
    
    await sharp(imagePath)
      .resize(thumbnailSize, thumbnailSize, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(thumbnailPath);
    
    return thumbnailPath;
  } catch (error) {
    console.error('生成缩略图失败:', error);
    throw error;
  }
};

// 获取图片的相对URL
const getImageUrl = (fileName) => {
  return `/uploads/images/${fileName}`;
};

// 获取缩略图的相对URL
const getThumbnailUrl = (fileName) => {
  return `/uploads/thumbnails/thumb_${fileName}`;
};

// 删除图片和缩略图
const deleteImageFiles = (fileName) => {
  try {
    const imagePath = path.join(__dirname, '..', 'uploads', 'images', fileName);
    const thumbnailPath = path.join(__dirname, '..', 'uploads', 'thumbnails', `thumb_${fileName}`);
    
    // 删除原图
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // 删除缩略图
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }
    
    return true;
  } catch (error) {
    console.error('删除图片文件失败:', error);
    throw error;
  }
};

module.exports = {
  generateThumbnail,
  getImageUrl,
  getThumbnailUrl,
  deleteImageFiles
};
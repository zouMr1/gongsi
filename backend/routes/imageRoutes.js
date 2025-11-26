const express = require('express');
const { check } = require('express-validator');
const { uploadImage, getImages, getImage, updateImage, deleteImage } = require('../controllers/imageController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/upload');

const router = express.Router();

// 上传图片路由
router.post('/', protect, [
  check('title', '图片标题不能为空').notEmpty(),
  check('title', '图片标题不能超过100个字符').isLength({ max: 100 }),
  check('description', '图片描述不能超过500个字符').optional().isLength({ max: 500 }),
  check('category', '无效的分类').optional().isIn(['equipment', 'course', 'creative', 'demand', 'other'])
], upload.single('image'), uploadImage);

// 获取图片列表路由
router.get('/', protect, getImages);

// 获取单个图片详情路由
router.get('/:id', protect, getImage);

// 更新图片信息路由
router.put('/:id', protect, [
  check('title', '图片标题不能为空').optional().notEmpty(),
  check('title', '图片标题不能超过100个字符').optional().isLength({ max: 100 }),
  check('description', '图片描述不能超过500个字符').optional().isLength({ max: 500 }),
  check('category', '无效的分类').optional().isIn(['equipment', 'course', 'creative', 'demand', 'other'])
], upload.single('image'), updateImage);

// 删除图片路由
router.delete('/:id', protect, deleteImage);

module.exports = router;
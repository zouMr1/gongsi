const Image = require('../models/Image');
const { validationResult } = require('express-validator');
const { generateThumbnail, getImageUrl, getThumbnailUrl, deleteImageFiles } = require('../utils/imageProcessor');
const path = require('path');

// 上传图片
exports.uploadImage = async (req, res) => {
  try {
    // 验证请求数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 检查是否有文件上传
    if (!req.file) {
      return res.status(400).json({ message: '请上传图片文件' });
    }

    const { title, description, tags, category, isPublic } = req.body;
    
    // 生成缩略图
    const thumbnailPath = await generateThumbnail(req.file.path);
    
    // 创建图片记录
    const image = await Image.create({
      userId: req.user._id,
      title,
      description,
      url: getImageUrl(req.file.filename),
      thumbnailUrl: getThumbnailUrl(req.file.filename),
      tags: tags ? JSON.parse(tags) : [],
      category: category || 'other',
      isPublic: isPublic !== undefined ? isPublic : true
    });

    res.status(201).json({
      success: true,
      image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取图片列表
exports.getImages = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tags, userId } = req.query;
    
    // 构建查询条件
    const query = {};
    
    // 如果指定了分类
    if (category) {
      query.category = category;
    }
    
    // 如果指定了标签
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    // 如果指定了用户ID
    if (userId) {
      query.userId = userId;
    }
    
    // 只显示公开的图片，除非是管理员或图片所有者
    if (req.user.role !== 'admin') {
      query.$or = [
        { isPublic: true },
        { userId: req.user._id }
      ];
    }
    
    // 计算分页
    const startIndex = (page - 1) * limit;
    
    // 查询图片
    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate('userId', 'username avatar');
    
    // 获取总数
    const total = await Image.countDocuments(query);
    
    res.status(200).json({
      success: true,
      images,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个图片详情
exports.getImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询图片
    const image = await Image.findById(id).populate('userId', 'username avatar');
    
    if (!image) {
      return res.status(404).json({ message: '图片不存在' });
    }
    
    // 检查权限：只有公开图片、管理员或图片所有者可以查看
    if (!image.isPublic && req.user.role !== 'admin' && image.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权访问此图片' });
    }
    
    res.status(200).json({
      success: true,
      image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新图片信息
exports.updateImage = async (req, res) => {
  try {
    // 验证请求数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { title, description, tags, category, isPublic } = req.body;
    
    // 查询图片
    const image = await Image.findById(id);
    
    if (!image) {
      return res.status(404).json({ message: '图片不存在' });
    }
    
    // 检查权限：只有管理员或图片所有者可以更新
    if (req.user.role !== 'admin' && image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权更新此图片' });
    }
    
    // 更新图片信息
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = JSON.parse(tags);
    if (category !== undefined) updateData.category = category;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    
    // 如果上传了新图片
    if (req.file) {
      // 生成缩略图
      const thumbnailPath = await generateThumbnail(req.file.path);
      
      // 更新URL
      updateData.url = getImageUrl(req.file.filename);
      updateData.thumbnailUrl = getThumbnailUrl(req.file.filename);
      
      // 删除旧图片文件
      const oldFileName = path.basename(image.url);
      deleteImageFiles(oldFileName);
    }
    
    const updatedImage = await Image.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('userId', 'username avatar');
    
    res.status(200).json({
      success: true,
      image: updatedImage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除图片
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查询图片
    const image = await Image.findById(id);
    
    if (!image) {
      return res.status(404).json({ message: '图片不存在' });
    }
    
    // 检查权限：只有管理员或图片所有者可以删除
    if (req.user.role !== 'admin' && image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权删除此图片' });
    }
    
    // 删除图片文件
    const fileName = path.basename(image.url);
    deleteImageFiles(fileName);
    
    // 删除数据库记录
    await Image.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: '图片删除成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};
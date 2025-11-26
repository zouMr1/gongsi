const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, '请提供图片标题'],
    trim: true,
    maxlength: [100, '图片标题不能超过100个字符']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, '图片描述不能超过500个字符'],
    default: ''
  },
  url: {
    type: String,
    required: [true, '请提供图片URL']
  },
  thumbnailUrl: {
    type: String,
    required: [true, '请提供缩略图URL']
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['equipment', 'course', 'creative', 'demand', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时间中间件
ImageSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Image', ImageSchema);
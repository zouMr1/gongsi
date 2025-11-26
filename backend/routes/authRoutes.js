const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/upload');

const router = express.Router();

// 注册路由
router.post('/register', [
  check('username', '用户名至少需要3个字符').isLength({ min: 3 }),
  check('email', '请提供有效的邮箱地址').isEmail(),
  check('password', '密码至少需要6个字符').isLength({ min: 6 })
], register);

// 登录路由
router.post('/login', [
  check('email', '请提供有效的邮箱地址').isEmail(),
  check('password', '密码不能为空').exists()
], login);

// 获取当前用户信息路由
router.get('/me', protect, getMe);

// 更新用户信息路由
router.put('/profile', protect, [
  check('username', '用户名至少需要3个字符').optional().isLength({ min: 3 }),
  check('bio', '个人简介不能超过500个字符').optional().isLength({ max: 500 })
], upload.single('avatar'), updateProfile);

// 更改密码路由
router.put('/change-password', protect, [
  check('currentPassword', '当前密码不能为空').exists(),
  check('newPassword', '新密码至少需要6个字符').isLength({ min: 6 })
], changePassword);

module.exports = router;
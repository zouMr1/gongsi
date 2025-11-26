# 3D打印生态平台

## 项目简介

3D打印生态平台是一个集设备共享、教育培训和创意交流于一体的综合性平台，旨在降低3D打印门槛，赋能用户创新需求。平台采用"服务+教育"双驱动模式，为个人创客、中小企业、中小学和3D打印兴趣群体提供全方位支持。

![3D打印生态平台](https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/002a1f49a79c472291277f10c0d6379b~tplv-a9rns2rl98-image.image?rcl=2025072207002916700000000199852&rk3s=8e244e90&rrcfp=f06b7f93&x-expires=1763749146&x-signature=k80bPm42a0e249MZ7hFp3d7XZ8Q%3D)

## 核心功能

### 1. 前端功能
- 响应式网站设计，适配各种设备
- 3D模型展示与交互
- 用户认证（登录/注册）
- 图片上传与管理
- 设备服务展示与预约
- 教育培训课程展示
- 创意作品展示与交流

### 2. 后端功能
- 用户认证与授权系统
- 图片上传、存储与管理
- RESTful API接口
- 数据验证与错误处理
- 文件处理与缩略图生成

## 技术栈

### 前端
- HTML5 / CSS3 / JavaScript
- Bootstrap 4
- Three.js (3D模型渲染)
- GSAP (动画效果)
- Chart.js (数据可视化)

### 后端
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (用户认证)
- Multer (文件上传)
- Sharp (图片处理)

## 项目结构

```
3dprint_ecosystem/
├── index.html          # 前端主页面
├── backend/            # 后端代码
│   ├── config/         # 配置文件
│   ├── controllers/    # 控制器
│   ├── middleware/     # 中间件
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   ├── utils/          # 工具函数
│   ├── server.js       # 后端入口文件
│   ├── package.json    # 后端依赖
│   └── .env            # 环境变量
└── README.md           # 项目说明
```

## 快速开始

### 前端

1. 直接打开 `index.html` 文件即可访问前端页面

### 后端

1. 确保已安装 Node.js 和 MongoDB

2. 进入后端目录并安装依赖
```bash
cd backend
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，设置 MongoDB 连接等配置
```

4. 启动后端服务
```bash
npm start
# 或使用开发模式
npm run dev
```

5. 后端服务将在 http://localhost:5000 启动

## API 文档

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新用户信息
- `PUT /api/auth/change-password` - 修改密码

### 图片相关

- `POST /api/images` - 上传图片
- `GET /api/images` - 获取图片列表
- `GET /api/images/:id` - 获取单个图片详情
- `PUT /api/images/:id` - 更新图片信息
- `DELETE /api/images/:id` - 删除图片

## 功能亮点

1. **响应式设计**：适配桌面、平板和移动设备
2. **3D模型交互**：使用 Three.js 实现3D模型展示
3. **用户友好界面**：直观的操作流程和清晰的视觉层次
4. **安全认证**：基于 JWT 的安全认证机制
5. **图片管理**：支持图片上传、预览、编辑和删除
6. **缩略图生成**：自动为上传的图片生成缩略图

## 后续开发计划

1. 完善设备预约系统
2. 开发在线支付功能
3. 添加实时聊天功能
4. 实现3D模型在线预览
5. 开发移动应用
6. 优化性能和用户体验

## 联系方式

如有任何问题或建议，请联系我们：
- 邮箱：contact@3dprintspace.com
- 电话：400-123-4567
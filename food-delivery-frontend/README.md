# Gourmet Velocity - 外卖点单系统前端

一个现代化、优雅的外卖点单系统前端应用，基于 Vue 3 + TypeScript + Element Plus 构建。

## 项目特色

### 设计理念 - "Gourmet Velocity"
- **核心理念**：融合食物的温暖诱人与外卖服务的快速便捷
- **美学风格**：现代、活力、精致、略带有机感
- **色彩体系**：
  - 主品牌色：#FF6B35 (橙红色 - 激发食欲)
  - 辅助亮色：#FFC145 (金黄色 - 用于重要按钮)
  - 强调色：#D32F2F (红色 - 用于警告或促销)
- **动效设计**：流畅的页面过渡、微交互反馈、状态转换动画

## 技术栈

- **框架**：Vue 3.4 (Composition API)
- **语言**：TypeScript 5.3
- **路由**：Vue Router 4.2
- **状态管理**：Pinia 2.1
- **UI 框架**：Element Plus 2.5
- **HTTP 客户端**：Axios 1.6
- **构建工具**：Vite 5.0
- **样式预处理**：Sass 1.69

## 项目结构

```
food-delivery-frontend/
├── src/
│   ├── assets/                 # 静态资源
│   │   └── styles/            # 全局样式
│   │       ├── _variables.scss    # CSS 变量
│   │       ├── _mixins.scss       # Sass 混入
│   │       └── main.scss          # 主样式文件
│   ├── components/             # 组件
│   │   ├── common/             # 通用组件
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── EmptyState.vue
│   │   │   ├── SkeletonCard.vue
│   │   │   └── SkeletonList.vue
│   │   ├── layout/            # 布局组件
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── Layout.vue
│   │   └── business/          # 业务组件
│   │       ├── ProductCard.vue
│   │       ├── CategoryFilter.vue
│   │       ├── CartDrawer.vue
│   │       └── OrderStatusBadge.vue
│   ├── composables/           # 组合式函数
│   │   └── useApi.ts
│   ├── router/                # 路由配置
│   │   └── index.ts
│   ├── stores/                # Pinia 状态管理
│   │   ├── auth.store.ts
│   │   ├── cart.store.ts
│   │   ├── order.store.ts
│   │   └── product.store.ts
│   ├── types/                 # TypeScript 类型定义
│   │   └── index.ts
│   ├── views/                 # 页面组件
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── HomeView.vue
│   │   ├── ProductDetailView.vue
│   │   ├── CartView.vue
│   │   ├── CheckoutView.vue
│   │   ├── PaymentView.vue
│   │   ├── PaymentResultView.vue
│   │   ├── OrdersView.vue
│   │   ├── OrderDetailView.vue
│   │   ├── ProfileView.vue
│   │   ├── AddressManagementView.vue
│   │   ├── EditProfileView.vue
│   │   └── ChangePasswordView.vue
│   ├── App.vue
│   ├── main.ts
│   └── env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 核心功能模块

### 1. 用户模块
- 用户注册/登录
- 个人信息管理
- 收货地址管理
- 密码修改

### 2. 商品模块
- 商品列表展示（支持分类、搜索、筛选）
- 商品详情展示
- 购物车管理

### 3. 订单模块
- 订单创建
- 订单列表（支持状态筛选）
- 订单详情
- 订单取消

### 4. 支付模块
- 多种支付方式选择
- 支付结果反馈

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 商品列表展示 |
| `/login` | 登录页 | 用户登录 |
| `/register` | 注册页 | 用户注册 |
| `/product/:id` | 商品详情 | 商品详细信息 |
| `/cart` | 购物车 | 购物车管理 |
| `/checkout` | 订单确认 | 订单确认页面 |
| `/payment` | 支付页 | 支付页面 |
| `/payment/result` | 支付结果 | 支付结果反馈 |
| `/orders` | 订单列表 | 订单列表 |
| `/orders/:id` | 订单详情 | 订单详情 |
| `/profile` | 个人中心 | 个人中心主页 |
| `/profile/address` | 地址管理 | 收货地址管理 |
| `/profile/edit` | 编辑资料 | 编辑个人信息 |
| `/profile/password` | 修改密码 | 修改登录密码 |

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 使用 Pinia 进行状态管理
- 组件命名使用 PascalCase
- 样式使用 Sass 预处理器
- 遵循 ESLint 代码规范

## API 接口

项目使用 Axios 进行 API 请求，所有接口都封装在 `composables/useApi.ts` 中。默认 API 基础路径为 `/api`，可根据实际情况在 Vite 配置中修改。

主要接口：
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取用户信息
- `GET /api/products` - 获取商品列表
- `GET /api/products/:id` - 获取商品详情
- `GET /api/cart` - 获取购物车
- `POST /api/cart/add` - 添加到购物车
- `PUT /api/cart/:id` - 更新购物车商品
- `DELETE /api/cart/:id` - 删除购物车商品
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `PUT /api/orders/:id/cancel` - 取消订单

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 性能优化

- 路由懒加载
- 组件按需导入
- 图片懒加载
- API 请求缓存
- CSS 动画优化

## 开发建议

1. **组件复用**：优先使用已有的通用组件和业务组件
2. **状态管理**：合理使用 Pinia stores，避免在组件间直接传递复杂状态
3. **API 调用**：统一使用 `useApi` composable，保持请求/响应格式一致
4. **样式管理**：使用 CSS 变量和 Sass 混入，保持样式一致性
5. **类型安全**：充分利用 TypeScript 的类型系统，避免使用 `any`

## License

MIT

## 作者

Gourmet Velocity Team

---

祝您使用愉快！如有问题，欢迎反馈。

# 数学竞赛在线学习平台 - 教师端前端

> 一个现代化的在线教学平台前端应用，支持直播授课、作业批改、学生管理等功能。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Zustand + React Query
- **样式**: Tailwind CSS 4
- **路由**: React Router 7
- **HTTP 客户端**: Axios
- **测试**: Vitest + Playwright
- **文档**: Storybook

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 填入实际值
```

### 启动开发服务器

```bash
# 使用 Mock 数据启动（推荐用于前端开发）
pnpm run dev:mock

# 或使用真实后端 API
pnpm run dev
```

访问 http://localhost:5173 查看应用。

## 项目结构

```
src/
├── app/                    # 应用入口层
│   ├── App.tsx            # 根组件
│   ├── AppProviders.tsx   # 全局 Providers
│   ├── router.tsx         # 路由配置
│   └── routes.ts          # 路由常量
├── components/            # 全局可复用组件
│   ├── ui/               # 基础 UI 组件
│   ├── cards/            # 卡片组件
│   ├── table/            # 表格组件
│   └── ...
├── layouts/               # 页面布局组件
├── modules/               # 业务模块（按功能域划分）
│   ├── dashboard/        # 仪表盘模块
│   ├── courses/          # 课程模块
│   ├── assignments/      # 作业模块
│   ├── live/             # 直播模块
│   └── ...
├── pages/                 # 页面组件
├── services/              # API 服务层
│   ├── apiClient.ts      # HTTP 客户端
│   ├── auth.service.ts   # 认证服务
│   ├── courses.service.ts
│   └── ...
├── hooks/                 # 自定义 Hooks
├── types/                 # 类型定义
├── data/mock/             # Mock 数据
├── styles/                # 全局样式
└── tests/                 # 测试文件
    ├── unit/             # 单元测试
    └── e2e/              # E2E 测试
```

## 可用脚本

| 脚本 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm dev:mock` | 使用 Mock 数据启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产构建 |
| `pnpm test` | 运行单元测试 |
| `pnpm test:watch` | 监听模式运行测试 |
| `pnpm test:coverage` | 生成测试覆盖率报告 |
| `pnpm test:e2e` | 运行 E2E 测试 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm lint:fix` | 自动修复 lint 问题 |
| `pnpm format` | 格式化代码 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm storybook` | 启动 Storybook |

## Mock/Real API 切换

项目支持在 Mock 数据和真实后端 API 之间切换：

### 使用 Mock 数据（推荐用于前端开发）

```bash
# 方式 1: 使用专用脚本
pnpm dev:mock

# 方式 2: 设置环境变量
VITE_USE_MOCK=true pnpm dev
```

### 使用真实后端 API

1. 在 `.env.local` 中设置：
```env
VITE_USE_MOCK=false
VITE_API_BASE=http://localhost:3000/api
```

2. 启动开发服务器：
```bash
pnpm dev
```

### Mock 数据位置

Mock 数据存放在 `src/data/mock/data.json`，其结构与后端 API 响应保持一致。

## 本地验收步骤

以下命令序列可用于验证项目正常工作：

```bash
# 1. 安装依赖
pnpm install

# 2. 类型检查
pnpm typecheck

# 3. 代码检查
pnpm lint

# 4. 运行单元测试
pnpm test

# 5. 启动开发服务器（使用 Mock）
pnpm dev:mock

# 6. 在浏览器中验证主流程：
#    - 访问 http://localhost:5173/login
#    - 使用演示账号登录（demo@example.com / demo123）
#    - 进入仪表盘，查看今日课程
#    - 点击"开始直播"进入直播页面
#    - 点击"结束课堂"结束直播
#    - 前往录播库查看生成的录播

# 7. 运行 E2E 测试
pnpm test:e2e
```

## 关键功能流程

### 登录流程

1. 访问 `/login` 页面
2. 输入账号和密码（演示账号：demo@example.com / demo123）
3. 点击登录按钮
4. 登录成功后跳转到仪表盘

### 直播流程

1. 在仪表盘点击"开始直播"或从课程详情进入
2. 进入直播页面，可以使用白板、聊天等功能
3. 点击"结束课堂"结束直播
4. 系统自动生成录播（状态：处理中 → 就绪）

### 直播页面 Deep-Link（参数化路由）

直播教学页面支持通过 URL 直接访问指定课程的直播，便于分享链接或从其他系统跳转：

**路由格式**：

| URL 格式 | 说明 | 示例 |
|----------|------|------|
| `/live/:courseId` | 推荐，通过路径参数指定课程 | `/live/course-live-1` |
| `/live?courseId=xxx` | 兼容旧逻辑，通过查询参数指定 | `/live?courseId=course-002` |
| `/live` | 无参数时使用默认课程 | 默认进入 `course-live-1` |

**优先级**：路径参数 > 查询参数 > 默认值

**Mock 模式测试**：

```bash
# 启动 Mock 模式开发服务器
pnpm dev:mock

# 在浏览器访问以下 URL 测试：
# http://localhost:5173/live/course-live-1
# http://localhost:5173/live/course-002
# http://localhost:5173/live?courseId=course-001
```

**Staging/生产环境**：

将 `localhost:5173` 替换为实际部署域名即可，例如：
- `https://your-domain.com/live/course-abc-123`

### 作业批改流程

1. 在仪表盘查看待批改作业
2. 点击进入批改工作室
3. 查看学生提交，添加批注和评分
4. 保存草稿或提交最终批改

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE` | 后端 API 地址 | `http://localhost:3000/api` |
| `VITE_USE_MOCK` | 是否使用 Mock 数据 | `true` |
| `VITE_WS_BASE` | WebSocket 服务地址 | `ws://localhost:3000` |
| `VITE_AGORA_APP_ID` | 声网 App ID（用于音视频） | - |
| `VITE_DEBUG` | 调试模式 | `false` |

> ⚠️ **安全警告**：请勿将敏感配置（如 API 密钥、App Certificate）提交到代码仓库！

## 测试

### 单元测试

使用 Vitest 进行单元测试：

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage

# 使用 UI 界面
pnpm test:ui
```

### E2E 测试

使用 Playwright 进行端到端测试：

```bash
# 安装 Playwright 浏览器
npx playwright install

# 运行所有 E2E 测试
pnpm test:e2e

# 使用 UI 模式
pnpm test:e2e:ui

# 运行带浏览器界面的测试
pnpm test:e2e:headed
```

## 组件文档

使用 Storybook 查看和开发组件：

```bash
# 启动 Storybook
pnpm storybook

# 构建静态文档
pnpm build-storybook
```

访问 http://localhost:6006 查看组件库。

## API 文档

- [API 参考文档](./spec/api-reference.md) - 完整的后端 API 规范
- [API 请求/响应示例](./spec/api-samples.md) - 具体的请求/响应示例
- [WebSocket 协议](./spec/ws-live.md) - 直播实时通信协议
- [JSON Schema](./spec/schemas/) - 数据模型定义

## 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

构建产物输出到 `dist/` 目录。

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feat/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feat/your-feature`
5. 创建 Pull Request

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 Bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具

### 代码质量

提交前会自动运行 lint 和格式化（通过 husky + lint-staged）。

## 许可证

MIT License

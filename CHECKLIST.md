# 验收检查清单 - Live Deep-Link 路由修复

## 自动化检查

| 检查项 | 命令 | 状态 | 备注 |
|--------|------|------|------|
| 依赖安装 | `pnpm install` | ✅ 通过 | |
| TypeScript 类型检查 | `pnpm typecheck` | ✅ 通过 | |
| ESLint 代码检查 | `pnpm lint` | - | 可选 |
| 单元测试 | `pnpm test` | ✅ 通过 | 45 tests passed |
| 构建 | `pnpm build` | ✅ 通过 | |
| E2E 测试 | `pnpm test:e2e` | - | 需要 Playwright 浏览器 |

## 功能验收

### 1. Deep-Link 路由

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 访问 `/live/course-live-1` | 渲染直播页面，显示课程 ID `course-live-1` | ⬜ |
| 访问 `/live/course-002` | 渲染直播页面，显示课程 ID `course-002` | ⬜ |
| 访问 `/live?courseId=course-001` | 渲染直播页面，显示课程 ID `course-001` | ⬜ |
| 访问 `/live` (无参数) | 渲染直播页面，使用默认课程 ID | ⬜ |
| 同时提供路径和查询参数 | 路径参数优先 | ⬜ |

### 2. 导航测试

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 从仪表盘点击"开始直播" | 跳转到 `/live` | ⬜ |
| 从课程列表进入课堂 | 跳转到 `/live/{courseId}` | ⬜ |
| 点击"返回课程"按钮 | 跳转到 `/courses/{courseId}` | ⬜ |

### 3. 页面元素

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 页面 data-testid | 存在 `live-teaching-page` | ⬜ |
| 课程 ID 显示 | 存在 `course-id-display` 且内容正确 | ⬜ |
| 直播状态徽章 | 存在 `live-status-badge` | ⬜ |
| 返回按钮 | 存在且可点击 | ⬜ |

## 手动测试步骤

### 步骤 1：启动服务

```bash
pnpm dev:mock
```

### 步骤 2：测试 Deep-Link

1. 打开浏览器访问 `http://localhost:5173/live/course-live-1`
2. 确认页面正常渲染（无 404）
3. 确认显示"课程 ID: course-live-1"
4. 确认直播状态徽章显示"Live"或"Idle"

### 步骤 3：测试查询参数

1. 访问 `http://localhost:5173/live?courseId=course-002`
2. 确认显示"课程 ID: course-002"

### 步骤 4：测试默认值

1. 访问 `http://localhost:5173/live`
2. 确认使用默认课程 ID `course-live-1`

### 步骤 5：测试优先级

1. 访问 `http://localhost:5173/live/path-course?courseId=query-course`
2. 确认显示"课程 ID: path-course"（路径参数优先）

### 步骤 6：测试导航

1. 访问首页 `http://localhost:5173/`
2. 点击"开始直播"按钮
3. 确认跳转到直播页面
4. 点击"返回课程"按钮
5. 确认跳转到课程详情页

## E2E 测试执行

```bash
# 安装 Playwright 浏览器（首次执行）
npx playwright install

# 运行所有 E2E 测试
pnpm test:e2e

# 仅运行 Deep-Link 测试
npx playwright test liveDeepLink.spec.ts
```

## 代码审查检查点

- [ ] 路由配置正确，`/live/:courseId` 优先于 `/live`
- [ ] courseId 解析逻辑正确（优先级：路径 > 查询 > 默认）
- [ ] 导航链接使用辅助函数生成 URL
- [ ] 页面组件接收正确的 props
- [ ] 单元测试覆盖主要场景
- [ ] Mock 数据包含默认课程
- [ ] 文档已更新

## 签字确认

| 角色 | 姓名 | 日期 | 签名 |
|------|------|------|------|
| 开发者 | | | |
| 审查者 | | | |
| 测试者 | | | |

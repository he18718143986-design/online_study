# 验收检查清单 - 全面质量检查与 Deep-Link 修复

## 自动化检查

| 检查项 | 命令 | 状态 | 备注 |
|--------|------|------|------|
| 依赖安装 | `pnpm install` | ✅ 通过 | |
| TypeScript 类型检查 | `pnpm typecheck` | ✅ 通过 | |
| ESLint 代码检查 | `pnpm lint` | - | 可选 |
| 单元测试 | `pnpm test` | ✅ 58 tests 通过 | |
| 构建 | `pnpm build` | ✅ 通过 | |
| E2E 测试 | `pnpm test:e2e` | - | 需要 Playwright |

## 功能验收 - Deep-Link 路由

### 直播页面 `/live/:courseId`

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 访问 `/live/course-live-1` | 渲染直播页面 | ⬜ |
| 访问 `/live/course-002` | 渲染直播页面 | ⬜ |
| 访问 `/live?courseId=course-001` | 渲染直播页面（查询参数） | ⬜ |
| 访问 `/live` | 使用默认课程 ID | ⬜ |

### 课程详情 `/courses/:courseId`

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 访问 `/courses/course-001` | 渲染课程详情页面 | ⬜ |
| 显示课程标题 | "数学竞赛训练 — 高一提升" | ⬜ |
| 显示课程统计 | 学生数、参与率等 | ⬜ |

### 录播详情 `/recordings/:recordingId`

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 访问 `/recordings/rec-001` | 渲染录播详情页面 | ⬜ |
| 显示录播标题 | "数学竞赛训练 2026-01-05" | ⬜ |
| 带 courseId 查询参数 | 正确筛选 | ⬜ |

### 作业详情 `/assignments/:assignmentId`

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 访问 `/assignments/assign-101` | 渲染作业详情页面 | ⬜ |
| 显示作业标题 | "第三章：平面几何综合练习" | ⬜ |
| 显示提交统计 | 提交数、待批改数 | ⬜ |

### 学生档案 `/students/:studentId`

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 访问 `/students/s001` | 渲染学生档案页面 | ⬜ |
| 非 404 页面 | 正常显示内容 | ⬜ |

### 404 兜底

| 测试场景 | 预期结果 | 状态 |
|----------|----------|------|
| 访问 `/random/unknown` | 显示 404 页面 | ⬜ |
| 显示"未找到"文字 | 友好错误提示 | ⬜ |

## 手动测试步骤

### 步骤 1：环境准备

```bash
# 安装依赖
pnpm install

# 类型检查
pnpm typecheck

# 单元测试
pnpm test
```

### 步骤 2：启动服务

```bash
pnpm dev:mock
```

### 步骤 3：测试 Deep-Link

在浏览器中依次访问以下 URL：

1. `http://localhost:5173/live/course-live-1`
   - ✅ 页面渲染正常
   - ✅ 显示课程 ID: course-live-1
   - ✅ 直播状态徽章可见

2. `http://localhost:5173/courses/course-001`
   - ✅ 页面渲染正常
   - ✅ 显示课程标题
   - ✅ 显示课程统计

3. `http://localhost:5173/recordings/rec-001`
   - ✅ 页面渲染正常
   - ✅ 显示录播标题

4. `http://localhost:5173/assignments/assign-101`
   - ✅ 页面渲染正常
   - ✅ 显示作业标题
   - ✅ 显示提交统计

5. `http://localhost:5173/students/s001`
   - ✅ 页面渲染正常

6. `http://localhost:5173/random/unknown`
   - ✅ 显示 404 页面

### 步骤 4：E2E 测试

```bash
# 安装 Playwright 浏览器
npx playwright install

# 运行所有 E2E 测试
pnpm test:e2e

# 仅运行 Deep-Link 测试
npx playwright test deepLink.spec.ts
```

## 代码审查检查点

- [x] 路由配置正确，参数化路由顺序合理
- [x] `useRouteId` Hook 优先级逻辑正确
- [x] 页面组件正确使用 `useRouteId`
- [x] 新增页面有 data-testid 便于测试
- [x] 类型定义完整
- [x] 单元测试覆盖主要场景
- [x] E2E 测试覆盖所有 Deep-Link
- [x] CI 配置完整

## CI 检查点

- [x] lint-and-typecheck job
- [x] unit-tests job
- [x] build job
- [x] e2e-tests job
- [x] smoke-test job (PR only)

## 签字确认

| 角色 | 姓名 | 日期 | 签名 |
|------|------|------|------|
| 开发者 | | | |
| 审查者 | | | |
| 测试者 | | | |

## 本地验证命令（可复制执行）

```bash
# 完整验证流程
pnpm install && \
pnpm typecheck && \
pnpm test && \
pnpm build && \
echo "✅ 所有检查通过"
```

```bash
# 启动并手动测试
pnpm dev:mock
# 然后在浏览器中访问上述 URL
```

```bash
# E2E 测试
npx playwright install chromium && \
pnpm test:e2e
```

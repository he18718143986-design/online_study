# 改动清单 - Live 教学页 Deep-Link 路由修复

## 版本信息

- **日期**: 2026-01-15
- **分支**: `cursor/-bc-b73e0cbe-eafb-4c70-b9b4-ef257904bba9-9d7d`
- **类型**: 功能增强 + Bug 修复

## 改动摘要

本次改动修复了直播教学页面的路由问题，使 `/live/:courseId` 参数化路由能正常工作，支持 Deep-Link 直接访问指定课程的直播页面。

## 改动文件清单

### 路由配置

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/app/routes.ts` | 修改 | 添加 `liveTeachingWithCourse` 路由常量、`getLiveTeachingUrl()` 和 `getCourseDetailUrl()` 辅助函数 |
| `src/app/router.tsx` | 修改 | 注册 `/live/:courseId` 参数化路由，确保路由匹配顺序正确 |

### 页面组件

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/pages/shell/LiveTeachingRoutePage.tsx` | 修改 | 从 URL params/query 解析 courseId，实现优先级：路径参数 > 查询参数 > 默认值 |
| `src/pages/live/LiveTeachingPage.tsx` | 修改 | 接收 courseId 作为必传 prop，添加 data-testid 属性便于测试 |
| `src/pages/dashboard/DashboardPage.tsx` | 修改 | 使用 `getLiveTeachingUrl()` 辅助函数生成直播页 URL |

### Mock 数据

| 文件 | 操作 | 说明 |
|------|------|------|
| `data/mock/data.json` | 修改 | 添加 `course-live-1` 默认直播课程数据 |

### 测试

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/tests/unit/hooks/useLiveSession.test.ts` | 新增 | useLiveSession hook 单元测试（9 个测试用例） |
| `src/tests/e2e/liveDeepLink.spec.ts` | 新增 | Deep-Link E2E 测试（9 个测试用例） |

### 文档

| 文件 | 操作 | 说明 |
|------|------|------|
| `README.md` | 修改 | 添加"直播页面 Deep-Link"使用说明 |
| `spec/api-samples.md` | 修改 | 添加获取直播会话 API 示例和 Deep-Link 路由说明 |

## 技术要点

### 路由解析优先级

```
1. 路径参数: /live/:courseId → params.courseId
2. 查询参数: /live?courseId=xxx → searchParams.get('courseId')
3. 默认值: 'course-live-1'
```

### 新增辅助函数

```typescript
// 生成直播页 URL
getLiveTeachingUrl(courseId: string): string
// => `/live/${encodeURIComponent(courseId)}`

// 生成课程详情页 URL
getCourseDetailUrl(courseId: string): string
// => `/courses/${encodeURIComponent(courseId)}`
```

## 本地验证步骤

```bash
# 1. 安装依赖
pnpm install

# 2. 类型检查
pnpm typecheck

# 3. 运行单元测试
pnpm test

# 4. 启动 Mock 模式开发服务器
pnpm dev:mock

# 5. 在浏览器测试 Deep-Link
#    - http://localhost:5173/live/course-live-1
#    - http://localhost:5173/live/course-002
#    - http://localhost:5173/live?courseId=course-001
#    - http://localhost:5173/live （默认课程）

# 6. 运行 E2E 测试
npx playwright install  # 首次需要安装浏览器
pnpm test:e2e
```

## 验收标准

- [x] `pnpm install` 成功
- [x] `pnpm typecheck` 通过
- [x] `pnpm test` 单元测试通过（45 tests）
- [x] `pnpm build` 构建成功
- [x] `/live/course-live-1` 能正常渲染直播页面
- [x] 页面显示正确的课程 ID

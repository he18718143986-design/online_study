# PR: 修复 Live 教学页 Deep-Link 路由

## 概述

本 PR 修复了直播教学页面的路由问题，使 `/live/:courseId` 参数化路由能正常工作，支持用户通过 Deep-Link 直接访问指定课程的直播页面。

## 问题描述

**原问题**：
- 路由表只注册了 `/live` 路由，没有注册 `/live/:courseId` 参数化路由
- 访问 `/live/course-live-1` 返回 404
- `useLiveSession` hook 只从 query 参数获取 courseId，不支持从 URL path params 解析

## 解决方案

### 1. 路由配置更新

- 在 `routes.ts` 添加 `liveTeachingWithCourse: '/live/:courseId'` 路由常量
- 在 `router.tsx` 注册参数化路由，确保 `/live/:courseId` 优先匹配
- 保留 `/live` 作为默认入口（兼容旧逻辑）

### 2. 组件逻辑更新

- `LiveTeachingRoutePage`: 实现 courseId 解析优先级
  - 优先从 `params.courseId` 获取
  - 其次从 `searchParams.courseId` 获取
  - 最后使用默认值 `'course-live-1'`
- `LiveTeachingPage`: 接收 `courseId` 作为必传 prop

### 3. 导航链接更新

- `DashboardPage`: 使用 `getLiveTeachingUrl()` 生成正确的直播页 URL

## 文件变更

### 新增文件
- `src/tests/unit/hooks/useLiveSession.test.ts` - Hook 单元测试
- `src/tests/e2e/liveDeepLink.spec.ts` - Deep-Link E2E 测试

### 修改文件
- `src/app/routes.ts` - 添加路由常量和辅助函数
- `src/app/router.tsx` - 注册参数化路由
- `src/pages/shell/LiveTeachingRoutePage.tsx` - 解析 courseId
- `src/pages/live/LiveTeachingPage.tsx` - 接收 courseId prop
- `src/pages/dashboard/DashboardPage.tsx` - 使用辅助函数
- `data/mock/data.json` - 添加 course-live-1 数据
- `README.md` - 添加 Deep-Link 使用说明
- `spec/api-samples.md` - 添加 API 示例

## 测试说明

### 自动化测试

```bash
# 运行单元测试
pnpm test

# 运行 E2E 测试
pnpm test:e2e
```

### 手动测试

1. 启动开发服务器：`pnpm dev:mock`
2. 访问以下 URL 验证：
   - `http://localhost:5173/live/course-live-1` - 应显示直播页面，课程 ID 为 `course-live-1`
   - `http://localhost:5173/live/course-002` - 应显示直播页面，课程 ID 为 `course-002`
   - `http://localhost:5173/live?courseId=course-001` - 应显示直播页面，课程 ID 为 `course-001`
   - `http://localhost:5173/live` - 应显示直播页面，使用默认课程 ID

3. 从仪表盘测试：
   - 访问首页 `/`
   - 点击"开始直播"按钮
   - 验证跳转到直播页面

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 路由匹配顺序 | 低 | 参数化路由放在精确路由之前，已测试验证 |
| 兼容性破坏 | 低 | 保留 `/live` 和查询参数方式，向后兼容 |
| Mock 数据缺失 | 低 | 已添加 `course-live-1` 默认数据 |

## 回滚方法

如需回滚，执行以下步骤：

```bash
# 1. 切换到目标分支
git checkout main

# 2. 回滚此 commit
git revert <commit-hash>

# 3. 推送回滚
git push origin main
```

或者直接在 GitHub 上点击 "Revert" 按钮。

## 检查清单

- [x] 代码通过 TypeScript 类型检查
- [x] 单元测试通过 (45 tests)
- [x] 构建成功
- [x] Deep-Link URL 正常工作
- [x] 文档已更新
- [x] 向后兼容（旧 URL 仍可用）

## 后端协作

本次改动为前端独立修复，无需后端配合。但建议后端确认以下 API：

- `GET /api/live/session?courseId=xxx` - 获取指定课程的直播会话信息
  - 用于 deep-link 场景下获取已存在的直播会话

## 相关文档

- [README - Deep-Link 使用说明](./README.md#直播页面-deep-link参数化路由)
- [API 示例 - 直播会话 API](./spec/api-samples.md#获取直播会话详情)

# PR: 项目级路由总架构设计与实现

## 概述

本 PR 对前端项目进行了项目级路由总架构设计与实现，建立了工程化、可维护的路由系统。

## 主要改动

### 1. 静态分析与导航图

- **`analysis/navigation_map.json`**: 分析了 58 个导航点，识别出 16 个硬编码路径
- **`analysis/navigation_graph.dot`**: 生成 Graphviz 导航图，可视化页面关系

### 2. 路由系统重构

**新增路由常量**:
```typescript
ROUTES.courseScheduleNew    // /courses/schedule/new
ROUTES.resourceUpload       // /resources/upload
ROUTES.assignmentGrading    // /assignments/:assignmentId/grading
```

**新增 URL Helpers**:
```typescript
getCourseEditUrl(courseId)
getRecordingsUrl(courseId?)
getAssignmentGradingUrl(assignmentId)
getGradingWorkspaceUrl(assignmentId?)
getAssignmentsUrl(notice?)
```

### 3. 页面组件统一

将所有页面的硬编码导航替换为 URL helpers：

| 页面 | 修改数量 |
|------|---------|
| DashboardPage | 8 处 |
| CourseDetailPage | 4 处 |
| AssignmentDetailPage | 2 处 |
| 其他页面 | 3 处 |

### 4. 文档

- **`spec/routes.md`**: 权威路由规范（路由表、导航图、设计决策）
- **`src/tests/e2e/README.md`**: E2E 测试指南

## 文件变更

### 新增文件
- `analysis/navigation_map.json` - 导航分析数据
- `analysis/navigation_graph.dot` - 导航图（Graphviz）
- `spec/routes.md` - 路由规范文档
- `src/tests/e2e/README.md` - E2E 测试指南

### 修改文件
- `src/app/routes.ts` - 路由常量与 helpers
- `src/app/router.tsx` - 路由注册
- `src/pages/dashboard/DashboardPage.tsx`
- `src/pages/courses/CourseDetailPage.tsx`
- `src/pages/courses/CourseEditPage.tsx`
- `src/pages/recordings/RecordingDetailPage.tsx`
- `src/pages/live/LiveTeachingPage.tsx`
- `src/pages/assignments/AssignmentDetailPage.tsx`
- `src/pages/assignments/NewAssignmentPage.tsx`
- `src/pages/assignments/GradingWorkspacePage.tsx`
- `src/pages/students/StudentListPage.tsx`
- `src/types/index.d.ts`

## 测试说明

### 自动化测试

```bash
# 类型检查
pnpm typecheck

# 单元测试
pnpm test

# 构建
pnpm build

# E2E 测试
npx playwright install
pnpm test:e2e
```

### 手动测试

1. 启动开发服务器：`pnpm dev:mock`
2. 访问以下 Deep-Link URL：

| URL | 预期结果 |
|-----|---------|
| `/assignments/assign-101/grading` | 作业批改页面 |
| `/courses/course-001` | 课程详情页面 |
| `/recordings/rec-001` | 录播详情页面 |
| `/live/course-live-1` | 直播页面 |

## 设计决策

### 为什么使用 URL Helper 函数？

1. **单一来源**: 集中管理 URL 生成逻辑
2. **类型安全**: 编译时检查参数
3. **重构友好**: 路径变更只需修改一处
4. **编码安全**: 自动处理 URL 编码

### 为什么新增 `/assignments/:assignmentId/grading`？

原来的实现使用 `/assignments/grading?assignmentId=xxx`，新增参数化路由：
- 支持 Deep-Link 直接分享
- URL 更简洁
- 与其他详情页保持一致

## 风险评估

| 风险 | 等级 | 缓解措施 |
|------|------|---------|
| 路由变更影响现有功能 | 低 | 保留查询参数兼容 |
| E2E 测试覆盖不足 | 中 | 新增 deepLink.spec.ts |
| 类型定义变更 | 低 | 仅添加不修改 |

## 回滚方法

```bash
git revert <commit-hash>
git push origin main
```

## 建议的 Commit 拆分

1. `analysis: 添加导航点分析和导航图`
2. `feat(routes): 扩展路由常量和 URL helpers`
3. `refactor(pages): 统一使用 URL helpers`
4. `docs: 添加路由规范文档`

## 后续工作

- [ ] 添加路由级懒加载（代码分割）
- [ ] 实现路由权限守卫
- [ ] 完善 E2E 测试覆盖

## 需要人工确认的点

1. **动态构建的 URL**: 以下位置的 URL 是动态构建的，需要确认是否正确：
   - `analysis/navigation_map.json` 中标记为 `needsHelper` 的导航点

2. **后端字段**: 以下字段名称需要与后端确认：
   - `ROUTE_METADATA` 中的权限字段（`roles`）
   - 重定向配置（`ROUTE_REDIRECTS`）

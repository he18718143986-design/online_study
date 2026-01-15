# 改动清单 - 项目级路由总架构设计与实现

## 版本信息

- **日期**: 2026-01-15
- **分支**: `cursor/-bc-b73e0cbe-eafb-4c70-b9b4-ef257904bba9-9d7d`
- **类型**: 架构重构 + 功能增强

## 改动摘要

本次改动对前端项目进行了项目级路由总架构设计与实现，包括：
1. 静态分析并生成导航数据（navigation_map.json）
2. 生成页面导航图（navigation_graph.dot）
3. 设计并实现工程化的路由系统
4. 统一所有页面的导航实现

## 改动文件清单

### 一、分析文件（新增）

| 文件 | 目的 |
|------|------|
| `analysis/navigation_map.json` | 导航点分析数据（58 个导航点） |
| `analysis/navigation_graph.dot` | Graphviz 导航图 |

### 二、路由系统（修改/新增）

| 文件 | 操作 | 目的 |
|------|------|------|
| `src/app/routes.ts` | 重构 | 完整的路由常量、URL helpers、元数据 |
| `src/app/router.tsx` | 重构 | 注册所有路由，添加向后兼容重定向 |
| `spec/routes.md` | 新增 | 权威路由规范文档 |

**新增路由**:
- `/assignments/:assignmentId/grading` - 作业批改（参数化）
- `/courses/schedule/new` - 新建课程日程
- `/resources/upload` - 上传资源（常量化）

**新增 URL Helpers**:
```typescript
getCourseEditUrl(courseId)
getRecordingsUrl(courseId?)
getAssignmentGradingUrl(assignmentId)
getGradingWorkspaceUrl(assignmentId?)
getAssignmentsUrl(notice?)
```

### 三、页面组件更新

| 文件 | 操作 | 变更内容 |
|------|------|---------|
| `src/pages/dashboard/DashboardPage.tsx` | 修改 | 使用 URL helpers |
| `src/pages/courses/CourseDetailPage.tsx` | 修改 | 使用 URL helpers |
| `src/pages/courses/CourseEditPage.tsx` | 重构 | 使用 useRouteId hook |
| `src/pages/recordings/RecordingDetailPage.tsx` | 修改 | 使用 URL helpers |
| `src/pages/live/LiveTeachingPage.tsx` | 修改 | 使用 URL helpers |
| `src/pages/assignments/AssignmentDetailPage.tsx` | 修改 | 使用 URL helpers |
| `src/pages/assignments/NewAssignmentPage.tsx` | 修改 | 使用 URL helpers |
| `src/pages/assignments/GradingWorkspacePage.tsx` | 重构 | 支持参数化路由 |
| `src/pages/students/StudentListPage.tsx` | 修改 | 使用 URL helpers |

### 四、类型定义

| 文件 | 操作 | 变更内容 |
|------|------|---------|
| `src/types/index.d.ts` | 修改 | 添加 Navigate 类型 |

### 五、文档

| 文件 | 操作 | 目的 |
|------|------|------|
| `spec/routes.md` | 新增 | 路由总表与规范 |
| `src/tests/e2e/README.md` | 新增 | E2E 测试指南 |
| `CHANGES.md` | 更新 | 本次改动清单 |
| `PR_DESCRIPTION.md` | 更新 | PR 描述模板 |
| `CHECKLIST.md` | 更新 | 验收清单 |

## URL Helper 使用统计

| 页面 | 之前（硬编码） | 之后（Helper） |
|------|--------------|---------------|
| DashboardPage | 8 | 0 |
| CourseDetailPage | 4 | 0 |
| AssignmentDetailPage | 2 | 0 |
| LiveTeachingPage | 1 | 0 |
| StudentListPage | 1 | 0 |
| **总计** | **16** | **0** |

## Deep-Link 路由覆盖

| 路由 | 状态 |
|------|------|
| `/live/:courseId` | ✅ 已实现 |
| `/courses/:courseId` | ✅ 已实现 |
| `/courses/:courseId/edit` | ✅ 已实现 |
| `/recordings/:recordingId` | ✅ 已实现 |
| `/assignments/:assignmentId` | ✅ 已实现 |
| `/assignments/:assignmentId/grading` | ✅ 新增 |
| `/students/:studentId` | ✅ 已实现 |
| `/exams/:examId` | ✅ 已注册 |

## 本地验证命令

```bash
# 1. 安装依赖
pnpm install

# 2. 类型检查
pnpm typecheck

# 3. 单元测试
pnpm test

# 4. 构建
pnpm build

# 5. 启动 Mock 模式
pnpm dev:mock

# 6. 测试 Deep-Link（浏览器访问）
# http://localhost:5173/assignments/assign-101/grading
# http://localhost:5173/courses/course-001
# http://localhost:5173/recordings/rec-001

# 7. E2E 测试
npx playwright install
pnpm test:e2e
```

## 验收结果

| 检查项 | 状态 |
|--------|------|
| `pnpm typecheck` | ✅ 通过 |
| `pnpm test` | ✅ 58 tests 通过 |
| `pnpm build` | ✅ 构建成功 |
| Deep-Link 路由 | ✅ 正常工作 |

## 回归风险

- **低风险**: 所有导航使用 URL helpers，更容易维护
- **低风险**: 路由常量集中管理，减少硬编码错误
- **注意**: 新增的 `/assignments/:assignmentId/grading` 路由需要确保 E2E 测试覆盖

# PR: 全面质量检查与 Deep-Link 路由修复

## 概述

本 PR 对前端项目进行了全面的质量检查和修复，重点解决：
- Deep-Link 路由支持不完整的问题
- Hook 与组件数据获取逻辑不一致的问题
- 测试覆盖不足的问题
- CI 流程不完整的问题

## 主要改动

### 1. 路由系统增强

**新增参数化路由**:
- `/recordings/:recordingId` - 录播详情页
- `/assignments/:assignmentId` - 作业详情页

**新增 URL 辅助函数**:
```typescript
getRecordingDetailUrl(recordingId, courseId?)
getAssignmentDetailUrl(assignmentId)
getStudentProfileUrl(studentId)
getExamDetailUrl(examId)
```

### 2. 统一的路由参数获取 Hook

新增 `useRouteId` Hook 系列，统一所有页面的路由参数获取逻辑：

```typescript
// 优先级：路径参数 > 查询参数 > fallback
const { id, source, isFromParams } = useRouteId('courseId', 'default')

// 便捷 Hook
const { id: courseId } = useCourseId()
const { id: recordingId } = useRecordingId()
const { id: assignmentId } = useAssignmentId()
```

### 3. 新增页面组件

- `RecordingDetailPage` - 录播详情页面，支持 Deep-Link
- `AssignmentDetailPage` - 作业详情页面，支持 Deep-Link

### 4. 测试补强

**单元测试** (新增 13 tests):
- `useRouteId` Hook 全面测试
- 优先级测试、空值处理测试

**E2E 测试** (新增 ~15 tests):
- 所有 Deep-Link 路由测试
- 导航集成测试
- 404 兜底测试

### 5. CI 流程

新增完整的 GitHub Actions CI 配置：
- Lint & TypeCheck
- Unit Tests
- Build Verification
- E2E Tests
- Smoke Tests (PR only)

## 文件变更

### 新增文件
- `src/hooks/useRouteId.ts`
- `src/pages/recordings/RecordingDetailPage.tsx`
- `src/pages/assignments/AssignmentDetailPage.tsx`
- `src/tests/unit/hooks/useRouteId.test.tsx`
- `src/tests/e2e/deepLink.spec.ts`
- `.github/workflows/ci.yml`

### 修改文件
- `src/app/routes.ts`
- `src/app/router.tsx`
- `src/pages/recordings/RecordingLibraryPage.tsx`
- `src/pages/courses/CourseDetailPage.tsx`
- `src/types/models/assignment.ts`
- `src/types/index.d.ts`

## 测试说明

### 自动化测试

```bash
# 单元测试
pnpm test

# E2E 测试
npx playwright install
pnpm test:e2e

# 特定 E2E 测试
npx playwright test deepLink.spec.ts
```

### 手动测试

1. 启动开发服务器：
```bash
pnpm dev:mock
```

2. 访问以下 Deep-Link URL 验证：

| URL | 预期结果 |
|-----|---------|
| `/live/course-live-1` | 直播页面，显示课程 ID |
| `/courses/course-001` | 课程详情页面 |
| `/recordings/rec-001` | 录播详情页面 |
| `/assignments/assign-101` | 作业详情页面 |
| `/students/s001` | 学生档案页面 |
| `/random/unknown` | 404 页面 |

## 风险评估

| 风险 | 等级 | 缓解措施 |
|------|------|---------|
| 路由匹配顺序 | 低 | 参数化路由正确排序，已测试验证 |
| Hook API 兼容性 | 低 | 使用标准 React Router API |
| E2E 测试环境 | 中 | 需要 Playwright 浏览器，CI 已配置 |

## 回滚方法

```bash
# 回滚此 PR
git revert <commit-hash>
git push origin main
```

或在 GitHub 上点击 "Revert" 按钮。

## 建议的 Commit 拆分

1. `feat(routes): 添加参数化路由和 URL 辅助函数`
2. `feat(hooks): 添加 useRouteId 统一路由参数获取`
3. `feat(pages): 添加录播详情和作业详情页面`
4. `refactor(pages): 使用 useRouteId 统一参数获取`
5. `test: 添加 useRouteId 单元测试和 Deep-Link E2E 测试`
6. `ci: 添加完整的 CI workflow`

## 需要后端配合的事项

无。本次改动为前端独立修复，所有 API 端点已通过 Mock 数据验证。

## 相关文档

- [Deep-Link 路由列表](./README.md#直播页面-deep-link参数化路由)
- [API 示例](./spec/api-samples.md)
- [变更日志](./CHANGES.md)

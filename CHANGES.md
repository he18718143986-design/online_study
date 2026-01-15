# 改动清单 - 全面质量检查与修复

## 版本信息

- **日期**: 2026-01-15
- **分支**: `cursor/-bc-b73e0cbe-eafb-4c70-b9b4-ef257904bba9-9d7d`
- **类型**: 功能增强 + 架构优化 + 测试补强

## 改动摘要

本次改动对前端项目进行了全面的质量检查和修复，重点解决以下问题：
1. 路由 Deep-Link 支持不完整
2. Hook 与组件的数据获取逻辑不一致
3. 测试覆盖不足
4. CI 流程不完整

## 改动文件清单

### 一、路由配置

| 文件 | 操作 | 目的 | 影响范围 |
|------|------|------|---------|
| `src/app/routes.ts` | 修改 | 添加所有参数化路由常量和 URL 生成辅助函数 | 全局路由 |
| `src/app/router.tsx` | 修改 | 注册新的参数化路由（录播详情、作业详情） | 路由系统 |

**新增路由**:
- `/recordings/:recordingId` - 录播详情
- `/assignments/:assignmentId` - 作业详情

**新增辅助函数**:
- `getRecordingDetailUrl(recordingId, courseId?)` - 生成录播详情 URL
- `getAssignmentDetailUrl(assignmentId)` - 生成作业详情 URL
- `getStudentProfileUrl(studentId)` - 生成学生档案 URL
- `getExamDetailUrl(examId)` - 生成考试详情 URL

### 二、统一的路由参数获取

| 文件 | 操作 | 目的 |
|------|------|------|
| `src/hooks/useRouteId.ts` | 新增 | 创建统一的路由参数获取 Hook |

**核心功能**:
- `useRouteId(paramName, fallback)` - 通用 Hook
- `useCourseId(fallback)` - 课程 ID 专用
- `useRecordingId(fallback)` - 录播 ID 专用
- `useAssignmentId(fallback)` - 作业 ID 专用
- `useStudentId(fallback)` - 学生 ID 专用

**优先级契约**:
1. 路径参数（params）- 最高
2. 查询参数（query）- 次优
3. fallback 值 - 最低

### 三、页面组件更新

| 文件 | 操作 | 目的 |
|------|------|------|
| `src/pages/recordings/RecordingDetailPage.tsx` | 新增 | 录播详情页面（支持 Deep-Link） |
| `src/pages/assignments/AssignmentDetailPage.tsx` | 新增 | 作业详情页面（支持 Deep-Link） |
| `src/pages/recordings/RecordingLibraryPage.tsx` | 修改 | 使用 `useRouteId` 统一参数获取 |
| `src/pages/courses/CourseDetailPage.tsx` | 修改 | 使用 `useRouteId` 统一参数获取 |

### 四、类型定义更新

| 文件 | 操作 | 目的 |
|------|------|------|
| `src/types/models/assignment.ts` | 修改 | 添加 `description` 字段 |
| `src/types/index.d.ts` | 修改 | 添加 `createMemoryRouter` 类型声明 |

### 五、测试补强

| 文件 | 操作 | 目的 |
|------|------|------|
| `src/tests/unit/hooks/useRouteId.test.tsx` | 新增 | useRouteId Hook 单元测试（13 tests） |
| `src/tests/e2e/deepLink.spec.ts` | 新增 | Deep-Link 路由 E2E 测试（15+ tests） |

### 六、CI 配置

| 文件 | 操作 | 目的 |
|------|------|------|
| `.github/workflows/ci.yml` | 新增 | 完整的 CI 流程（Lint/TypeCheck/Test/Build/E2E） |

**CI Jobs**:
1. `lint-and-typecheck` - 代码质量检查
2. `unit-tests` - 单元测试
3. `build` - 构建验证
4. `e2e-tests` - E2E 测试
5. `smoke-test` - PR 快速验证

## Deep-Link 路由列表

| 路由 | 参数 | 示例 |
|------|------|------|
| `/live/:courseId` | courseId | `/live/course-live-1` |
| `/courses/:courseId` | courseId | `/courses/course-001` |
| `/recordings/:recordingId` | recordingId | `/recordings/rec-001` |
| `/assignments/:assignmentId` | assignmentId | `/assignments/assign-101` |
| `/students/:studentId` | studentId | `/students/s001` |

## 本地验证步骤

```bash
# 1. 安装依赖
pnpm install

# 2. 类型检查
pnpm typecheck

# 3. 运行单元测试
pnpm test

# 4. 构建
pnpm build

# 5. 启动 Mock 模式
pnpm dev:mock

# 6. 测试 Deep-Link（在浏览器中访问）
# - http://localhost:5173/live/course-live-1
# - http://localhost:5173/courses/course-001
# - http://localhost:5173/recordings/rec-001
# - http://localhost:5173/assignments/assign-101
# - http://localhost:5173/students/s001

# 7. 运行 E2E 测试
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

- **低风险**: 路由配置变更，已通过类型检查和测试验证
- **低风险**: 新增 Hook 使用标准 React Router API
- **注意**: E2E 测试需要 Playwright 浏览器环境

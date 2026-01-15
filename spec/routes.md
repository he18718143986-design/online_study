# 路由总表（Route Specification）

本文档是项目路由的权威规范，所有路由定义和导航实现必须与本文档保持一致。

## 目录

1. [路由架构概览](#路由架构概览)
2. [路由总表](#路由总表)
3. [Deep-Link 路由](#deep-link-路由)
4. [导航图](#导航图)
5. [URL Helper 函数](#url-helper-函数)
6. [向后兼容策略](#向后兼容策略)
7. [权限与角色](#权限与角色)

---

## 路由架构概览

### Shell 布局分类

项目使用四种 Shell 布局来组织页面：

| Shell | 描述 | 特点 |
|-------|------|------|
| **PublicShellPage** | 公开页面 | 无需登录，无侧边栏 |
| **MainShellPage** | 主布局 | 带侧边栏导航 |
| **DetailShellPage** | 详情布局 | 带返回导航和面包屑 |
| **ImmersiveShellPage** | 沉浸式布局 | 全屏体验（直播） |

### 路由命名规则

```
列表页：/resources (复数)
详情页：/resources/:resourceId (带参数)
编辑页：/resources/:resourceId/edit
操作页：/resources/:resourceId/action
子页面：/resources/subpage
```

---

## 路由总表

### 公开页面

| 路径 | 组件 | 描述 | Deep-Link |
|------|------|------|-----------|
| `/login` | LoginPage | 登录页面 | ❌ |

### 主布局页面（MainShell）

| 路径 | 组件 | 描述 | Deep-Link |
|------|------|------|-----------|
| `/` | DashboardPage | 教学总览 | ❌ |
| `/courses/schedule` | CourseSchedulePage | 课程日程 | ❌ |
| `/courses/schedule/new` | CourseSchedulePage | 新建课程日程 | ❌ |
| `/recordings` | RecordingLibraryPage | 录播库 | ❌ |
| `/recordings/:recordingId` | RecordingDetailPage | 录播详情 | ✅ |
| `/resources` | ResourceLibraryPage | 教学资源库 | ❌ |
| `/resources/upload` | UploadResourcePage | 上传资源 | ❌ |
| `/assignments` | AssignmentManagementPage | 作业管理 | ❌ |
| `/assignments/new` | NewAssignmentPage | 新建作业 | ❌ |
| `/assignments/:assignmentId` | AssignmentDetailPage | 作业详情 | ✅ |
| `/assignments/:assignmentId/grading` | GradingWorkspacePage | 作业批改 | ✅ |
| `/assignments/grading` | GradingWorkspacePage | 批改工作室 | ❌ |
| `/assignments/gradebook` | GradebookPage | 成绩册 | ❌ |
| `/exams` | ExamManagementPage | 考试管理 | ❌ |
| `/exams/:examId` | ExamManagementPage | 考试详情 | ✅ |
| `/students` | StudentListPage | 学生列表 | ❌ |
| `/question-bank` | QuestionBankPage | 题库管理 | ❌ |
| `/analytics` | TeachingAnalyticsPage | 教学分析 | ❌ |
| `/inbox` | InboxPage | 收件箱 | ❌ |
| `/settings` | SettingsPage | 系统设置 | ❌ |
| `/collaboration/review` | CollaborationReviewPage | 协作审核 | ❌ |

### 详情布局页面（DetailShell）

| 路径 | 组件 | 描述 | Deep-Link |
|------|------|------|-----------|
| `/courses/:courseId` | CourseDetailPage | 课程详情 | ✅ |
| `/courses/:courseId/edit` | CourseEditPage | 编辑课程 | ✅ |
| `/students/:studentId` | StudentProfilePage | 学生档案 | ✅ |

### 沉浸式布局页面（ImmersiveShell）

| 路径 | 组件 | 描述 | Deep-Link |
|------|------|------|-----------|
| `/live` | LiveTeachingRoutePage | 直播授课（默认） | ❌ |
| `/live/:courseId` | LiveTeachingRoutePage | 直播授课 | ✅ |

---

## Deep-Link 路由

支持通过 URL 直接访问的参数化路由：

| 路径 | 参数 | 示例 URL | URL Helper |
|------|------|----------|------------|
| `/live/:courseId` | courseId | `/live/course-live-1` | `getLiveTeachingUrl()` |
| `/courses/:courseId` | courseId | `/courses/course-001` | `getCourseDetailUrl()` |
| `/courses/:courseId/edit` | courseId | `/courses/course-001/edit` | `getCourseEditUrl()` |
| `/recordings/:recordingId` | recordingId | `/recordings/rec-001` | `getRecordingDetailUrl()` |
| `/assignments/:assignmentId` | assignmentId | `/assignments/assign-101` | `getAssignmentDetailUrl()` |
| `/assignments/:assignmentId/grading` | assignmentId | `/assignments/assign-101/grading` | `getAssignmentGradingUrl()` |
| `/students/:studentId` | studentId | `/students/s001` | `getStudentProfileUrl()` |
| `/exams/:examId` | examId | `/exams/exam-001` | `getExamDetailUrl()` |

### 参数获取优先级

所有支持 Deep-Link 的页面遵循统一的参数获取优先级：

```
1. route.params (路径参数) - 最高优先级
2. route.query (查询参数) - 次优先级
3. props/fallback - 最低优先级
```

使用 `useRouteId` Hook 系列实现此契约。

---

## 导航图

### ASCII 版本

```
                                    ┌─────────────────────────────────────────────────────────────┐
                                    │                         MainShell                            │
                                    │  ┌──────────┐  ┌─────────────┐  ┌───────────────┐            │
                                    │  │Dashboard │──│CourseSchedule│  │  Recordings   │            │
                                    │  │    /     │  │ /courses/   │  │ /recordings   │            │
                                    │  └────┬─────┘  │  schedule   │  └───────┬───────┘            │
                                    │       │        └─────────────┘          │                    │
                                    │       │                                 ▼                    │
┌────────────┐    登录成功          │       │        ┌─────────────┐  ┌───────────────┐            │
│  /login    │────────────────────▶│       │        │ Assignments │  │RecordingDetail│            │
│ LoginPage  │                      │       │        │/assignments │  │/recordings/:id│            │
└────────────┘                      │       │        └──────┬──────┘  └───────────────┘            │
                                    │       │               │                                      │
                                    │       │               ▼                                      │
                                    │       │        ┌─────────────────────┐                       │
                                    │       │        │ AssignmentDetail    │                       │
                                    │       │        │/assignments/:id     │                       │
                                    │       │        └──────┬──────────────┘                       │
                                    │       │               │                                      │
                                    │       │               ▼                                      │
                                    │       │        ┌─────────────────────┐                       │
                                    │       │        │AssignmentGrading    │                       │
                                    │       │        │/assignments/:id/    │                       │
                                    │       │        │     grading         │                       │
                                    │       │        └─────────────────────┘                       │
                                    └───────┼──────────────────────────────────────────────────────┘
                                            │
                                            │
                ┌───────────────────────────┴───────────────────────────┐
                │                                                       │
                ▼                                                       ▼
┌───────────────────────────────┐                   ┌───────────────────────────────┐
│         DetailShell           │                   │       ImmersiveShell          │
│  ┌────────────────────────┐   │                   │  ┌────────────────────────┐   │
│  │    CourseDetail        │   │                   │  │   LiveTeaching         │   │
│  │  /courses/:courseId    │◀──┼───────────────────┼──│   /live/:courseId      │   │
│  └────────────┬───────────┘   │                   │  └────────────────────────┘   │
│               │               │                   └───────────────────────────────┘
│               ▼               │
│  ┌────────────────────────┐   │
│  │     CourseEdit         │   │
│  │/courses/:courseId/edit │   │
│  └────────────────────────┘   │
│                               │
│  ┌────────────────────────┐   │
│  │   StudentProfile       │   │
│  │ /students/:studentId   │   │
│  └────────────────────────┘   │
└───────────────────────────────┘
```

### Graphviz DOT 文件

详见 `analysis/navigation_graph.dot`，可使用以下命令生成可视图：

```bash
dot -Tsvg analysis/navigation_graph.dot -o analysis/navigation_graph.svg
dot -Tpng analysis/navigation_graph.dot -o analysis/navigation_graph.png
```

---

## URL Helper 函数

所有参数化 URL 生成必须使用 `src/app/routes.ts` 中的 helper 函数：

### 可用的 Helper 函数

```typescript
// 直播
getLiveTeachingUrl(courseId: string): string
// '/live/course-001'

// 课程
getCourseDetailUrl(courseId: string): string
// '/courses/course-001'

getCourseEditUrl(courseId: string): string
// '/courses/course-001/edit'

// 录播
getRecordingDetailUrl(recordingId: string, courseId?: string): string
// '/recordings/rec-001' 或 '/recordings/rec-001?courseId=course-001'

getRecordingsUrl(courseId?: string): string
// '/recordings' 或 '/recordings?courseId=course-001'

// 作业
getAssignmentDetailUrl(assignmentId: string): string
// '/assignments/assign-101'

getAssignmentGradingUrl(assignmentId: string): string
// '/assignments/assign-101/grading'

getGradingWorkspaceUrl(assignmentId?: string): string
// '/assignments/grading' 或 '/assignments/grading?assignmentId=assign-101'

getAssignmentsUrl(notice?: string): string
// '/assignments' 或 '/assignments?notice=published'

// 学生
getStudentProfileUrl(studentId: string): string
// '/students/s001'

// 考试
getExamDetailUrl(examId: string): string
// '/exams/exam-001'
```

### 使用示例

```tsx
import { getLiveTeachingUrl, getCourseDetailUrl } from '@/app/routes'

// ✅ 正确：使用 helper 函数
navigate(getLiveTeachingUrl(courseId))
navigate(getCourseDetailUrl(courseId))

// ❌ 错误：硬编码路径
navigate(`/live/${courseId}`)
navigate(ROUTES.courseDetail.replace(':courseId', courseId))
```

---

## 向后兼容策略

### 重定向配置

如需支持旧 URL，在 `src/app/routes.ts` 的 `ROUTE_REDIRECTS` 中配置：

```typescript
export const ROUTE_REDIRECTS = [
  // 旧的作业批改路由
  { from: '/grading/:assignmentId', to: '/assignments/:assignmentId/grading' },
  // 旧的课程路由
  { from: '/course/:id', to: '/courses/:id' },
]
```

### 查询参数兼容

所有 Deep-Link 路由同时支持查询参数方式：

```
/live/:courseId          等价于 /live?courseId=xxx
/assignments/:id/grading 等价于 /assignments/grading?assignmentId=xxx
```

---

## 权限与角色

### 角色定义

| 角色 | 描述 |
|------|------|
| `teacher` | 教师 |
| `student` | 学生 |
| `admin` | 管理员 |

### 路由权限矩阵

| 路由 | teacher | student | admin |
|------|---------|---------|-------|
| `/` | ✅ | ❌ | ✅ |
| `/live/:courseId` | ✅ | ❌ | ✅ |
| `/courses/:courseId` | ✅ | 只读 | ✅ |
| `/assignments/:id/grading` | ✅ | ❌ | ✅ |
| `/students/:studentId` | ✅ | 仅本人 | ✅ |

> TODO: confirm with backend - 权限字段名称和具体实现

---

## 设计决策说明

### 为什么使用参数化路由而非查询参数？

1. **SEO 友好**：参数化路由对搜索引擎更友好
2. **可分享性**：URL 更简洁，便于分享
3. **浏览器历史**：更好的浏览器历史管理
4. **类型安全**：更容易进行类型检查

### 为什么保留查询参数兼容？

1. **渐进迁移**：允许旧代码逐步迁移
2. **灵活性**：某些场景下查询参数更灵活（如多参数筛选）
3. **API 一致性**：与后端 API 风格保持一致

### 为什么使用 URL Helper 函数？

1. **单一来源**：集中管理 URL 生成逻辑
2. **类型安全**：编译时检查参数
3. **重构友好**：路径变更只需修改一处
4. **编码安全**：自动处理 URL 编码

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-01-15 | 初始版本，完整路由规范 |

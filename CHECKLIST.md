# 验收检查清单 - 路由总架构设计与实现

## 自动化检查

| 检查项 | 命令 | 状态 | 备注 |
|--------|------|------|------|
| 依赖安装 | `pnpm install` | ✅ 通过 | |
| TypeScript 类型检查 | `pnpm typecheck` | ✅ 通过 | |
| ESLint 代码检查 | `pnpm lint` | - | 可选 |
| 单元测试 | `pnpm test` | ✅ 58 tests 通过 | |
| 构建 | `pnpm build` | ✅ 通过 | |
| E2E 测试 | `pnpm test:e2e` | - | 需要 Playwright |

## 功能验收 - 路由系统

### URL Helper 函数

| Helper | 示例输出 | 状态 |
|--------|---------|------|
| `getLiveTeachingUrl('course-001')` | `/live/course-001` | ⬜ |
| `getCourseDetailUrl('course-001')` | `/courses/course-001` | ⬜ |
| `getCourseEditUrl('course-001')` | `/courses/course-001/edit` | ⬜ |
| `getRecordingDetailUrl('rec-001')` | `/recordings/rec-001` | ⬜ |
| `getRecordingsUrl('course-001')` | `/recordings?courseId=course-001` | ⬜ |
| `getAssignmentDetailUrl('assign-101')` | `/assignments/assign-101` | ⬜ |
| `getAssignmentGradingUrl('assign-101')` | `/assignments/assign-101/grading` | ⬜ |
| `getGradingWorkspaceUrl('assign-101')` | `/assignments/grading?assignmentId=assign-101` | ⬜ |
| `getAssignmentsUrl('published')` | `/assignments?notice=published` | ⬜ |
| `getStudentProfileUrl('s001')` | `/students/s001` | ⬜ |

### Deep-Link 路由

| 路由 | 测试 URL | 预期结果 | 状态 |
|------|----------|---------|------|
| 直播 | `/live/course-live-1` | 渲染直播页面 | ⬜ |
| 课程详情 | `/courses/course-001` | 渲染课程详情 | ⬜ |
| 课程编辑 | `/courses/course-001/edit` | 渲染编辑页面 | ⬜ |
| 录播详情 | `/recordings/rec-001` | 渲染录播详情 | ⬜ |
| 作业详情 | `/assignments/assign-101` | 渲染作业详情 | ⬜ |
| 作业批改 | `/assignments/assign-101/grading` | 渲染批改页面 | ⬜ |
| 学生档案 | `/students/s001` | 渲染学生档案 | ⬜ |

### 页面导航

| 起点 | 操作 | 终点 | 状态 |
|------|------|------|------|
| Dashboard | 点击"进入课堂" | `/live/:courseId` | ⬜ |
| Dashboard | 点击"批改作业" | `/assignments/:id/grading` | ⬜ |
| CourseDetail | 点击"编辑课程" | `/courses/:id/edit` | ⬜ |
| CourseDetail | 点击"查看录播" | `/recordings/:id` | ⬜ |
| AssignmentDetail | 点击"开始批改" | `/assignments/:id/grading` | ⬜ |
| StudentList | 点击"查看档案" | `/students/:id` | ⬜ |

## 手动测试步骤

### 步骤 1：环境准备

```bash
# 安装依赖
pnpm install

# 类型检查
pnpm typecheck

# 单元测试
pnpm test

# 构建
pnpm build
```

### 步骤 2：启动服务

```bash
pnpm dev:mock
```

### 步骤 3：测试 Deep-Link

在浏览器中访问以下 URL，验证页面正确渲染：

1. `http://localhost:5173/live/course-live-1`
2. `http://localhost:5173/courses/course-001`
3. `http://localhost:5173/courses/course-001/edit`
4. `http://localhost:5173/recordings/rec-001`
5. `http://localhost:5173/assignments/assign-101`
6. `http://localhost:5173/assignments/assign-101/grading`
7. `http://localhost:5173/students/s001`

### 步骤 4：测试导航流程

1. 从 Dashboard 点击"进入课堂"按钮，验证跳转到直播页面
2. 从 Dashboard 点击课程卡片，验证跳转到课程详情
3. 从课程详情点击"编辑"，验证跳转到编辑页面
4. 从作业详情点击"开始批改"，验证跳转到批改页面

### 步骤 5：E2E 测试

```bash
# 安装 Playwright 浏览器
npx playwright install chromium

# 运行 E2E 测试
pnpm test:e2e

# 或运行特定测试
npx playwright test deepLink.spec.ts
```

## 代码审查检查点

### 路由配置

- [x] 所有路由使用 `ROUTES` 常量
- [x] 参数化路由顺序正确（具体在前，通配在后）
- [x] 新增路由有对应的 URL helper
- [x] 路由元数据完整

### 页面组件

- [x] 所有导航使用 URL helper
- [x] 无硬编码路径字符串
- [x] 使用 `useRouteId` hook 获取参数
- [x] 参数获取优先级正确（params > query > fallback）

### 文档

- [x] `spec/routes.md` 路由表完整
- [x] 导航图与实际代码一致
- [x] E2E 测试指南清晰

## 分析文件验证

### navigation_map.json

- [x] 包含所有导航点（58 个）
- [x] 标记了需要 helper 的位置
- [x] 识别了缺失的路由

### navigation_graph.dot

- [x] 可用 Graphviz 生成图片
- [x] 节点和边与代码一致

```bash
# 生成图片验证
dot -Tsvg analysis/navigation_graph.dot -o analysis/navigation_graph.svg
```

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
```

```bash
# E2E 测试
npx playwright install chromium && \
pnpm test:e2e
```

```bash
# 生成导航图
dot -Tsvg analysis/navigation_graph.dot -o analysis/navigation_graph.svg && \
echo "导航图已生成: analysis/navigation_graph.svg"
```

# 改动清单

## 版本：v1.1.0

本次更新将前端工程从原型状态完善为可交付的生产级代码。

---

## 改动摘要

### A1: 项目结构与配置 ✅

| 文件 | 改动类型 | 目的 |
|------|----------|------|
| `.env.example` | 新增 | 提供环境变量模板，列出所有必需的配置项 |
| `package.json` | 修改 | 完善 scripts（lint/format/test/storybook），添加新依赖 |
| `.eslintrc.cjs` | 新增 | ESLint 配置，确保代码质量 |
| `.prettierrc` | 新增 | Prettier 配置，统一代码风格 |
| `.prettierignore` | 新增 | Prettier 忽略规则 |
| `vitest.config.ts` | 新增 | Vitest 测试框架配置 |
| `.storybook/main.ts` | 新增 | Storybook 主配置 |
| `.storybook/preview.ts` | 新增 | Storybook 预览配置 |

### A2: API 服务层 ✅

| 文件 | 改动类型 | 目的 |
|------|----------|------|
| `spec/api-samples.md` | 新增 | 完整的 API 请求/响应示例文档 |
| `src/services/auth.service.ts` | 已有/完善 | 认证服务（登录/登出/注册） |
| `src/services/questions.service.ts` | 已有/完善 | 题库服务 |
| `src/services/notifications.service.ts` | 已有/完善 | 通知服务 |

### A3-A4: 页面交互与 Mock 切换 ✅

| 文件 | 改动类型 | 目的 |
|------|----------|------|
| `src/pages/auth/LoginPage.tsx` | 已有/完善 | 完整的登录交互（表单验证、错误处理） |
| `src/components/ui/ConfirmDialog.tsx` | 已有/完善 | 确认对话框组件 |
| `src/components/ui/Toast.tsx` | 已有/完善 | Toast 通知组件 |
| `src/components/ui/EmptyState.tsx` | 已有/完善 | 空状态组件 |
| `src/components/ui/ErrorState.tsx` | 已有/完善 | 错误状态组件 |
| `src/components/ui/LoadingSpinner.tsx` | 已有/完善 | 加载状态组件 |
| `src/modules/dashboard/components/TodayCoursesSection.tsx` | 修改 | 添加四态支持 |
| `src/modules/dashboard/components/PendingAssignments.tsx` | 修改 | 添加四态支持 |
| `src/modules/recordings/components/RecordingList.tsx` | 修改 | 添加四态支持 |

### A5: 文档 ✅

| 文件 | 改动类型 | 目的 |
|------|----------|------|
| `README.md` | 重写 | 完整的项目文档（安装、使用、测试、部署） |
| `CHANGES.md` | 新增 | 本次改动清单 |
| `PR_DESCRIPTION.md` | 新增 | PR 描述模板 |
| `CHECKLIST.md` | 新增 | 验收清单 |

### B1: 代码质量工具 ✅

| 文件 | 改动类型 | 目的 |
|------|----------|------|
| `.eslintrc.cjs` | 新增 | ESLint 规则配置 |
| `.prettierrc` | 新增 | 代码格式化配置 |
| `package.json` | 修改 | 添加 lint-staged 配置 |

### B3: 测试 ✅

| 文件 | 改动类型 | 目的 |
|------|----------|------|
| `src/tests/setup.ts` | 新增 | 测试环境配置 |
| `src/tests/unit/services/apiClient.test.ts` | 新增 | API 客户端单元测试 |
| `src/tests/unit/services/auth.service.test.ts` | 新增 | 认证服务单元测试 |
| `src/tests/unit/components/ui/ConfirmDialog.test.tsx` | 新增 | 确认对话框组件测试 |
| `src/tests/unit/components/ui/Toast.test.tsx` | 新增 | Toast 组件测试 |
| `src/tests/unit/hooks/useLiveSocket.test.ts` | 新增 | WebSocket Hook 测试 |

### Storybook ✅

| 文件 | 改动类型 | 目的 |
|------|----------|------|
| `src/components/ui/ConfirmDialog.stories.tsx` | 新增 | 确认对话框 Story |
| `src/components/ui/Toast.stories.tsx` | 新增 | Toast Story |
| `src/components/cards/CourseCard.stories.tsx` | 新增 | 课程卡片 Story |

---

## 新增依赖

### 生产依赖
- `clsx` - 条件类名工具
- `zustand` - 轻量状态管理

### 开发依赖
- `vitest` + `@vitest/ui` + `@vitest/coverage-v8` - 单元测试框架
- `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event` - React 测试工具
- `jsdom` - DOM 模拟环境
- `eslint` + 相关插件 - 代码检查
- `prettier` + `eslint-config-prettier` - 代码格式化
- `husky` + `lint-staged` - Git 钩子
- `storybook` + 相关包 - 组件文档
- `msw` - API Mock（预留）

---

## 验证步骤

```bash
# 1. 安装依赖
pnpm install

# 2. 类型检查（预期：无错误）
pnpm typecheck

# 3. 代码检查（预期：无错误或仅警告）
pnpm lint

# 4. 运行单元测试（预期：全部通过）
pnpm test

# 5. 启动开发服务器
pnpm dev:mock

# 6. 浏览器验证
#    - 访问 http://localhost:5173/login
#    - 使用 demo@example.com / demo123 登录
#    - 验证仪表盘、课程列表、直播功能

# 7. E2E 测试
pnpm test:e2e

# 8. Storybook
pnpm storybook
#    - 访问 http://localhost:6006
#    - 查看组件文档
```

---

## 已知限制

1. **Agora RTC**：需要真实 App ID 才能使用音视频功能，开发时使用占位 UI
2. **S3 上传**：需要后端配置，开发时使用本地 mock
3. **ESLint 警告**：部分历史代码存在 lint 警告，不影响功能

---

## 后续建议

1. 完善 CI/CD 配置（GitHub Actions）
2. 添加更多单元测试覆盖
3. 实现真实的 RTC 集成
4. 添加性能监控（Web Vitals）

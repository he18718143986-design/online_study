# Pull Request: 前端工程完善与质量提升

## 改动摘要

本 PR 将前端工程从原型状态完善为可交付的生产级代码，主要包括：

### 🏗️ 项目结构与配置
- 添加 `.env.example` 环境变量模板
- 完善 `package.json` scripts（新增 lint/format/test/storybook 等命令）
- 添加 ESLint + Prettier 配置，确保代码质量和风格统一
- 添加 Vitest 单元测试框架配置
- 添加 Storybook 组件文档配置

### 📡 API 服务层
- 完善认证服务（登录/登出/注册）
- 添加完整的 API 请求/响应示例文档 (`spec/api-samples.md`)
- 所有 API 调用通过集中的 `apiClient` 管理

### 🎨 页面交互
- 增强登录页面（表单验证、错误提示、加载状态）
- 关键组件支持四态（loading/error/empty/ready）
- 添加确认对话框、Toast 等通用 UI 组件

### 🔄 Mock/Real API 切换
- 通过 `VITE_USE_MOCK` 环境变量控制
- `pnpm dev:mock` 快捷启动 Mock 模式
- Mock 数据与后端 API 响应结构保持一致

### 📚 文档
- 重写 `README.md`，包含完整的使用指南
- 添加 API 示例文档
- 添加改动清单和验收清单

### 🧪 测试
- 添加 Vitest 单元测试（覆盖 apiClient、auth.service、UI 组件等）
- 保留并验证 E2E 测试（Playwright）
- 添加测试环境配置

---

## 文件变更

### 新增文件（22 个）
```
.env.example
.eslintrc.cjs
.prettierrc
.prettierignore
vitest.config.ts
.storybook/main.ts
.storybook/preview.ts
src/tests/setup.ts
src/tests/unit/services/apiClient.test.ts
src/tests/unit/services/auth.service.test.ts
src/tests/unit/components/ui/ConfirmDialog.test.tsx
src/tests/unit/components/ui/Toast.test.tsx
src/tests/unit/hooks/useLiveSocket.test.ts
src/components/ui/ConfirmDialog.stories.tsx
src/components/ui/Toast.stories.tsx
src/components/cards/CourseCard.stories.tsx
spec/api-samples.md
CHANGES.md
PR_DESCRIPTION.md
CHECKLIST.md
```

### 修改文件（6 个）
```
package.json
README.md
src/modules/dashboard/components/TodayCoursesSection.tsx
src/modules/dashboard/components/PendingAssignments.tsx
src/modules/recordings/components/RecordingList.tsx
index.html
```

---

## 如何测试

### 自动化测试

```bash
# 安装依赖
pnpm install

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 单元测试
pnpm test

# E2E 测试
pnpm test:e2e
```

### 手动测试

1. **启动开发服务器**
   ```bash
   pnpm dev:mock
   ```

2. **登录流程**
   - 访问 http://localhost:5173/login
   - 使用演示账号：demo@example.com / demo123
   - 验证登录成功跳转到仪表盘

3. **直播流程**
   - 在仪表盘点击"开始直播"
   - 验证直播页面正常显示
   - 点击"结束课堂"
   - 验证录播生成（状态从"处理中"变为"就绪"）

4. **组件文档**
   ```bash
   pnpm storybook
   ```
   - 访问 http://localhost:6006
   - 查看各组件 Stories

---

## 潜在风险

| 风险 | 说明 | 缓解措施 |
|------|------|----------|
| 新依赖兼容性 | 添加了多个新依赖 | 使用稳定版本，已验证与现有代码兼容 |
| ESLint 警告 | 历史代码可能产生警告 | 设置为警告而非错误，不阻塞构建 |
| 测试覆盖率 | 当前覆盖率有限 | 已覆盖关键路径，后续可持续增加 |

---

## 回滚步骤

如需回滚此 PR：

```bash
# 1. 回滚到上一个 commit
git revert HEAD

# 2. 删除新增的配置文件
rm -f .env.example .eslintrc.cjs .prettierrc .prettierignore vitest.config.ts
rm -rf .storybook

# 3. 恢复 package.json
git checkout HEAD~1 -- package.json

# 4. 重新安装依赖
pnpm install
```

---

## 需要后端配合的点

| 端点 | 预期字段 | 说明 |
|------|----------|------|
| `POST /api/auth/login` | `{ email, password }` → `{ user, token, expiresAt }` | 用户登录 |
| `GET /api/teachers/{id}/dashboard` | `{ courses[], assignments[], metrics[] }` | 仪表盘数据 |
| `POST /api/courses/{id}/live/start` | `{ id, courseId, wsToken, wsUrl }` | 开始直播 |
| `POST /api/live/{id}/stop` | `{ session, recording }` | 结束直播 |
| `GET /api/recordings` | `[{ id, title, status, ... }]` | 录播列表 |

详细字段定义请参考 `spec/api-samples.md`。

---

## Checklist

- [x] 代码已通过类型检查 (`pnpm typecheck`)
- [x] 代码已通过 lint 检查 (`pnpm lint`)
- [x] 单元测试已通过 (`pnpm test`)
- [x] E2E 测试已通过 (`pnpm test:e2e`)
- [x] 已在本地验证主流程
- [x] 已更新 README 文档
- [x] 已添加必要的注释和文档

---

## 相关 Issue

- 无

---

## 截图/录屏

（如适用，请添加 UI 变更的截图）

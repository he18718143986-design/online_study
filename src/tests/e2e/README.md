# E2E 测试指南

本目录包含使用 Playwright 编写的端到端（E2E）测试。

## 环境准备

### 安装 Playwright 浏览器

首次运行测试前，需要安装 Playwright 浏览器：

```bash
# 安装所有浏览器
npx playwright install

# 或仅安装 Chromium（更快）
npx playwright install chromium
```

### 安装系统依赖（Linux）

在某些 Linux 环境下，可能需要安装额外的系统依赖：

```bash
npx playwright install-deps
```

## 运行测试

### 本地运行

```bash
# 运行所有 E2E 测试
pnpm test:e2e

# 使用 UI 模式（推荐调试）
pnpm test:e2e:ui

# 运行特定测试文件
npx playwright test deepLink.spec.ts

# 运行带浏览器界面的测试
npx playwright test --headed

# 运行特定浏览器
npx playwright test --project=chromium
```

### CI 环境运行

在 CI 环境（如 GitHub Actions）中，测试会自动以 headless 模式运行：

```bash
CI=true pnpm test:e2e
```

## 测试文件说明

| 文件 | 描述 |
|------|------|
| `smoke.spec.ts` | 冒烟测试（登录、仪表盘、课程详情） |
| `deepLink.spec.ts` | Deep-Link 路由测试 |
| `liveDeepLink.spec.ts` | 直播页面 Deep-Link 测试 |
| `liveTeaching.spec.ts` | 直播教学功能测试 |
| `recordings.spec.ts` | 录播功能测试 |
| `assignments.spec.ts` | 作业功能测试 |
| `students.spec.ts` | 学生管理功能测试 |

## Mock 模式

所有 E2E 测试默认在 Mock 模式下运行，使用本地 Mock 数据。

Mock 数据位置：
- `data/mock/data.json` - 主 Mock 数据文件
- `src/data/mock/` - 模块级 Mock 数据

## Deep-Link 测试 URL

以下 URL 应该在 Mock 模式下正常工作：

```
/live/course-live-1
/courses/course-001
/recordings/rec-001
/assignments/assign-101
/assignments/assign-101/grading
/students/s001
```

## 调试技巧

### 使用 Playwright Inspector

```bash
PWDEBUG=1 npx playwright test deepLink.spec.ts
```

### 生成测试报告

```bash
# 运行测试并生成报告
npx playwright test --reporter=html

# 查看报告
npx playwright show-report
```

### 截图和录像

测试失败时会自动保存截图和录像到 `test-results/` 目录。

## 常见问题

### 1. 浏览器启动失败

```bash
# 重新安装浏览器
npx playwright install --force
```

### 2. 超时错误

在 `playwright.config.ts` 中调整超时时间：

```typescript
export default defineConfig({
  timeout: 60000, // 60 秒
  expect: {
    timeout: 10000 // 10 秒
  }
})
```

### 3. 端口被占用

确保 5173 端口未被占用，或在配置中修改端口。

## 添加新测试

1. 在 `src/tests/e2e/` 目录创建 `*.spec.ts` 文件
2. 使用 `@playwright/test` 的 `test` 和 `expect` 函数
3. 使用 `DEEP_LINK_ROUTES` 常量获取测试 URL

示例：

```typescript
import { test, expect } from '@playwright/test'
import { DEEP_LINK_ROUTES } from '@/app/routes'

test('应该能访问课程详情', async ({ page }) => {
  await page.goto('/courses/course-001')
  await expect(page.locator('[data-testid="course-detail-page"]')).toBeVisible()
})
```

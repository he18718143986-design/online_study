# 工程规则（架构守门）

目标：把“可交互原型”做成可持续演进的工程，不让路由/状态/数据层在迭代中退化。

## 1. 路由与导航边界

- 只允许 `pages/**` 进行导航（使用路由库的 `navigate`/`useNavigate` 等）
- `modules/**` 与 `components/**` 必须 route-agnostic：
  - 不引入路由库
  - 不直接拼 URL
  - 通过回调对外发事件：`onNavigate(to)` / `onEnter(courseId)` / `onBack()` 等
- 所有路径常量集中在单一位置（例如 `src/app/routes.ts`），路由注册集中在单一位置（例如 `src/app/router.tsx`）

## 2. Props 命名约定（推荐）

- 事件回调统一 `onXxx`（动词开头）：`onSaveDraft`、`onSubmit`、`onConfirmEndLive`
- boolean 用 `isXxx/hasXxx/canXxx`：`isLoading`、`hasError`、`canEdit`
- 异步提交回调尽量返回 `Promise<void>`，由 page 负责 toast/loading/error

## 3. 状态与长事务

- 直播/转码/导入/报表这类长事务必须显式状态机：
  - UI 至少具备 `loading / error / empty / ready`
  - 任务型流程提供 `job_id + status + progress + error`

## 4. 最小 CI 守门（推荐）

- `pnpm typecheck`
- `pnpm test:e2e`

（可选）增加 schema 校验：对 mock JSON 做 AJV 校验，避免字段错位。

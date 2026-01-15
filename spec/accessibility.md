# 可访问性（A11y）验收清单（最小可用）

目的：把“可访问性”从口号变成可测的 checklist，用于 PR 自检与 Playwright/CI 兜底。

## 1. 通用要求

- 所有可点击元素具备：`hover`、`focus-visible`、`disabled` 三态
- 所有图标按钮提供可读名称：`aria-label` 或可见文本
- 所有页面至少具备四态：`loading / error / empty / ready`

## 2. Modal / Confirm / Drawer

- `role="dialog"` + `aria-modal="true"`
- 提供 `aria-labelledby`（标题）与（可选）`aria-describedby`（说明）
- 打开时聚焦到标题或第一个可操作元素
- Esc 关闭（若业务允许），关闭后焦点回到触发按钮

## 3. 表格与列表

- 可排序列：`aria-sort` 正确反映状态（none/ascending/descending）
- 可选中行：checkbox 具备 label，支持键盘切换
- 空态具备明确文案，避免“空白屏”

## 4. Toast / Alert

- 成功/提示：`role="status"`
- 失败/阻断错误：`role="alert"`

## 5. 直播/白板工具条（若实现）

- 工具条可通过键盘导航：左右键移动、Enter 选择
- 当前工具有可感知状态（视觉 + `aria-pressed`/`aria-selected`）

## 6. Playwright 最小自动检查点（建议）

- Tab 可访问：关键 CTA 按 Tab 可聚焦
- Dialog 打开后：焦点落在 dialog 内
- 重要按钮：存在可访问名称（`getByRole('button', { name: ... })` 可定位）

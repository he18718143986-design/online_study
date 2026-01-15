/**
 * Live Teaching Deep-Link E2E 测试
 * 测试直播教学页面的参数化路由功能
 */
import { test, expect } from '@playwright/test'

test.describe('Live Teaching Deep-Link', () => {
	test('通过 /live/:courseId 路径参数访问直播页面', async ({ page }) => {
		// 直接访问参数化路由
		await page.goto('/live/course-live-1')

		// 验证页面正确渲染
		await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()

		// 验证课程 ID 正确显示
		await expect(page.locator('[data-testid="course-id-display"]')).toContainText('course-live-1')

		// 验证直播状态徽章存在
		await expect(page.locator('[data-testid="live-status-badge"]')).toBeVisible()
	})

	test('通过 /live?courseId=xxx 查询参数访问直播页面', async ({ page }) => {
		// 使用查询参数访问
		await page.goto('/live?courseId=course-002')

		// 验证页面正确渲染
		await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()

		// 验证课程 ID 正确显示
		await expect(page.locator('[data-testid="course-id-display"]')).toContainText('course-002')
	})

	test('访问 /live 不带参数时使用默认 courseId', async ({ page }) => {
		// 访问不带参数的直播页面
		await page.goto('/live')

		// 验证页面正确渲染
		await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()

		// 验证使用默认课程 ID
		await expect(page.locator('[data-testid="course-id-display"]')).toContainText('course-live-1')
	})

	test('路径参数优先于查询参数', async ({ page }) => {
		// 同时提供路径参数和查询参数，路径参数应优先
		await page.goto('/live/path-course?courseId=query-course')

		// 验证页面正确渲染
		await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()

		// 验证使用路径参数中的课程 ID
		await expect(page.locator('[data-testid="course-id-display"]')).toContainText('path-course')
	})

	test('从仪表盘进入课堂应跳转到正确的直播页面', async ({ page }) => {
		// 从首页开始
		await page.goto('/')

		// 等待页面加载
		await expect(page.locator('[role="group"][aria-label="快捷操作"]')).toBeVisible()

		// 点击"开始直播"按钮
		await page.getByRole('button', { name: '开始直播' }).click()

		// 验证跳转到直播页面
		await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()
	})

	test('直播页面应显示返回按钮', async ({ page }) => {
		await page.goto('/live/course-live-1')

		// 验证返回按钮存在
		const backButton = page.getByRole('button', { name: '返回课程详情' })
		await expect(backButton).toBeVisible()
	})

	test('点击返回按钮应跳转到课程详情页', async ({ page }) => {
		await page.goto('/live/course-live-1')

		// 点击返回按钮
		await page.getByRole('button', { name: '返回课程详情' }).click()

		// 验证跳转到课程详情页
		await expect(page).toHaveURL(/\/courses\/course-live-1$/)
	})

	test('直播状态应随会话状态变化', async ({ page }) => {
		await page.goto('/live/course-live-1')

		// 等待直播会话启动
		await expect(page.locator('[data-testid="live-status-badge"]')).toBeVisible()

		// 初始状态可能是 Idle 或 Live（取决于 mock 行为）
		const badge = page.locator('[data-testid="live-status-badge"]')
		await expect(badge).toHaveText(/Live|Idle/)

		// 等待自动启动后变为 Live
		await expect(badge).toHaveText('Live', { timeout: 5000 })
	})

	test('使用中文 courseId 应正确编码和解码', async ({ page }) => {
		// 测试特殊字符处理（URL 编码）
		const encodedCourseId = encodeURIComponent('课程-测试-001')
		await page.goto(`/live/${encodedCourseId}`)

		// 验证页面正确渲染
		await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()
	})
})

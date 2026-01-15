import { test, expect } from '@playwright/test'

function todayIsoDate() {
	return new Date().toISOString().slice(0, 10)
}

test('smoke: login -> dashboard', async ({ page }) => {
	await page.goto('/login')
	await page.getByRole('button', { name: '登录' }).click()

	await expect(page).toHaveURL('/')
	await expect(page.getByRole('group', { name: '快捷操作' })).toBeVisible()
})

test('smoke: dashboard -> course detail', async ({ page }) => {
	await page.goto('/')
	await expect(page.getByRole('list', { name: '今日课程列表' })).toBeVisible()

	await page.locator('button[aria-label="课程更多操作"]').first().click()
	await expect(page).toHaveURL(/\/courses\//)
	await expect(page.getByRole('navigation', { name: '课程详情标签' })).toBeVisible()
})

test('smoke: end live -> recording processing -> ready', async ({ page }) => {
	const courseId = 'course-live-1'
	const recordingTitle = `录播 ${courseId} ${todayIsoDate()}`

	await page.goto('/')
	await page.getByRole('button', { name: '开始直播' }).click()

	// End live (this triggers mock recording creation)
	await page.getByRole('button', { name: '结束课堂' }).click()

	// Return to course detail via callback-driven button
	await page.getByRole('button', { name: '返回课程' }).click()
	await expect(page).toHaveURL(new RegExp(`/courses/${courseId}$`))

	// Open recordings tab
	await page.getByRole('button', { name: '录播', exact: true }).click()

	// First, we should see the new recording in processing state
	const processingRow = page
		.locator('div', { has: page.getByRole('heading', { name: recordingTitle }) })
		.filter({ hasText: '生成中' })
		.first()
	await expect(processingRow).toBeVisible()

	// Then it should flip to ready within a few seconds
	const readyRow = page
		.locator('div', { has: page.getByRole('heading', { name: recordingTitle }) })
		.filter({ hasText: '录播已生成' })
		.first()
	await expect(readyRow).toBeVisible({ timeout: 10_000 })
})

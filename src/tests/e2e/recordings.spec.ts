import { test, expect } from '@playwright/test'

function todayIsoDate() {
	return new Date().toISOString().slice(0, 10)
}

test('recording appears in library and becomes ready after ending live', async ({ page }) => {
	const courseId = 'course-live-1'
	const recordingTitlePrefix = `录播 ${courseId}`

	await page.goto('/')
	await page.getByRole('button', { name: '开始直播' }).click()
	await expect(page.getByText('Live', { exact: true }).first()).toBeVisible({ timeout: 5000 })
	await page.getByRole('button', { name: '结束课堂' }).click()

	await expect(page.getByText('录播已创建，处理中', { exact: true })).toBeVisible({ timeout: 5000 })
	await page.getByRole('button', { name: '前往录播库' }).click()
	await expect(page).toHaveURL(/\/recordings\?courseId=/)

	await expect(page.getByPlaceholder('courseId')).toHaveValue(courseId)

	const card = page.locator('article', { hasText: recordingTitlePrefix })
	await page.locator('article h3').allTextContents()

	// Poll and refresh to allow the newly created recording to surface
	for (let i = 0; i < 6; i++) {
		await page.getByRole('button', { name: '手动刷新' }).click()
		if ((await card.count()) > 0) break
		await page.waitForTimeout(2000)
	}

	await expect(card).toBeVisible({ timeout: 20000 })

	// Keep refreshing until the recording finishes processing (mock transition happens on a later fetch).
	const readyBadge = card.getByText('已就绪', { exact: true })
	for (let i = 0; i < 12; i++) {
		if ((await readyBadge.count()) > 0) break
		await page.getByRole('button', { name: '手动刷新' }).click()
		await page.waitForTimeout(1500)
	}
	await expect(readyBadge).toBeVisible({ timeout: 20000 })
})

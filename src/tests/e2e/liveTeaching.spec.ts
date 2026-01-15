import { test, expect } from '@playwright/test'

test('live teaching actions are persisted via service layer (mock)', async ({ page }) => {
	await page.goto('/live')

	// Wait until session becomes live.
	await expect(page.getByText('Live', { exact: true }).first()).toBeVisible({ timeout: 5000 })

	await page.getByRole('button', { name: '共享屏幕' }).click()
	await page.getByRole('button', { name: '插入题目' }).click()
	await page.getByRole('button', { name: '打开聊天' }).click()
	await page.getByRole('button', { name: '开始录制' }).click()

	const events = await page.evaluate(() => {
		try {
			return JSON.parse(window.localStorage.getItem('mock.liveTeaching.events') || '[]')
		} catch {
			return []
		}
	})

	expect(Array.isArray(events)).toBeTruthy()
	const types = (events as any[]).map((e) => e.type)
	expect(types).toContain('share_screen')
	expect(types).toContain('insert_question')
	expect(types).toContain('open_chat')
	expect(types).toContain('toggle_recording')

	const sessionIds = (events as any[]).map((e) => e.sessionId).filter(Boolean)
	expect(sessionIds.length).toBeGreaterThan(0)
})

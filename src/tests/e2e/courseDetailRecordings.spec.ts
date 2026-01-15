import { test, expect } from '@playwright/test'

test('course detail shows new recording after ending live (cross-page)', async ({ page }) => {
	const courseId = 'course-live-1'
	await page.goto(`/courses/${courseId}`)

	await page.getByRole('button', { name: '开始直播' }).click()
	await expect(page.getByText('Live', { exact: true }).first()).toBeVisible({ timeout: 5000 })
	await page.getByRole('button', { name: '结束课堂' }).click()
	await expect(page.getByText('录播已创建，处理中', { exact: true })).toBeVisible({ timeout: 5000 })

	const hasRecordingInStorage = await page.evaluate((cid) => {
		try {
			const raw = window.localStorage.getItem('mock.recordings')
			const list = raw ? JSON.parse(raw) : []
			return Array.isArray(list) && list.some((r: any) => r && r.courseId === cid)
		} catch {
			return false
		}
	}, courseId)
	expect(hasRecordingInStorage).toBeTruthy()

	// Navigate back to course detail for the same course.
	await page.getByRole('button', { name: '返回课程详情' }).click()
	await expect(page).toHaveURL(new RegExp(`/courses/${courseId}$`))

	// Switch to recordings tab and ensure the recording for this course appears.
	await page.getByRole('navigation', { name: '课程详情标签' }).getByRole('button', { name: '录播', exact: true }).click()
	await expect(page.getByText(new RegExp(`录播\\s+${courseId}`)).first()).toBeVisible({ timeout: 20000 })
})

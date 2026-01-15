import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

function tmpCsv(name: string, content: string) {
	const dir = path.join(process.cwd(), '.tmp-e2e')
	fs.mkdirSync(dir, { recursive: true })
	const p = path.join(dir, name)
	fs.writeFileSync(p, content, 'utf-8')
	return p
}

test('assignments: create -> visible in list', async ({ page }) => {
	const title = `e2e 作业 ${Date.now()}`

	await page.goto('/assignments')
	await expect(page.getByRole('heading', { name: '作业管理' })).toBeVisible({ timeout: 10000 })

	await page.getByRole('button', { name: '新建作业' }).click()

	// Modal is a simple fixed overlay without explicit role; scope by the overlay container.
	const modal = page.locator('div.fixed.inset-0.z-50')
	await expect(modal).toBeVisible({ timeout: 5000 })

	const titleInput = modal.getByRole('textbox').first()
	await titleInput.fill(title)
	// On smaller viewports the submit button can be off-screen; submit via Enter.
	await titleInput.press('Enter')

	await expect(page.getByText('已新建作业草稿', { exact: true })).toBeVisible({ timeout: 10000 })
	await expect(page.getByText(title, { exact: true })).toBeVisible({ timeout: 10000 })
})

test('assignments: create from new page shows in list', async ({ page }) => {
	const title = `E2E 作业 ${Date.now()}`
	await page.goto('/assignments/new?courseId=course-live-1')
	await expect(page.getByRole('heading', { name: '新建作业' })).toBeVisible({ timeout: 10000 })

	await page.getByPlaceholder('请输入标题').fill(title)
	await page.getByLabel('立即发布').check()
	await page.getByRole('button', { name: '保存并返回' }).click()

	await expect(page).toHaveURL(/\/assignments(\?|$)/)
	await expect(page.getByText('已发布作业')).toBeVisible({ timeout: 10000 })
	await expect(page.getByRole('list').getByText(title, { exact: true })).toBeVisible({ timeout: 10000 })
})

test('assignments: export downloads csv and import adds rows', async ({ page }) => {
	await page.goto('/assignments')
	await expect(page.getByRole('heading', { name: '作业管理' })).toBeVisible({ timeout: 10000 })

	const downloadPromise = page.waitForEvent('download')
	await page.getByRole('button', { name: '导出 CSV' }).click()
	const download = await downloadPromise
	await expect(download.suggestedFilename()).toBe('assignments.csv')
	const downloadPath = await download.path()
	expect(downloadPath).toBeTruthy()
	const csv = fs.readFileSync(downloadPath!, 'utf-8')
	expect(csv).toContain('id,courseId,title,dueAt,totalPoints,status')
	expect(csv.split('\n').length).toBeGreaterThan(2)

	const importTitle = `E2E CSV 作业 ${Date.now()}`
	const filePath = tmpCsv(
		'assignments_import.csv',
		`id,courseId,title,dueAt,totalPoints,status\n,course-live-1,${importTitle},2026-01-31T12:00:00+08:00,100,draft\n`
	)
	await page.locator('input[type="file"][aria-label="导入 CSV 文件"]').setInputFiles(filePath)
	await expect(page.getByText(/CSV 导入成功：新增 1 条作业/)).toBeVisible({ timeout: 10000 })
	await expect(page.getByRole('list').getByText(importTitle, { exact: true })).toBeVisible({ timeout: 10000 })
})

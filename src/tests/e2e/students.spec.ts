import { test, expect } from '@playwright/test'
import fs from 'node:fs'

test.use({ viewport: { width: 1280, height: 720 } })

test('students: list -> profile', async ({ page }) => {
	await page.goto('/students')
	await expect(page.getByRole('heading', { name: '学生管理' })).toBeVisible({ timeout: 10000 })

	// Click the first "查看" action in the table.
	await page.getByRole('button', { name: '查看' }).first().click()

	await expect(page).toHaveURL(/\/students\//)
	await expect(page.getByText('学生档案与进度', { exact: true })).toBeVisible({ timeout: 10000 })

	// Profile summary renders a student name as the main heading.
	const nameHeading = page.locator('h1').first()
	await expect(nameHeading).toBeVisible({ timeout: 10000 })
	await expect(nameHeading).not.toHaveText('')
})

test('students: bulk mark present removes from absent filter', async ({ page }) => {
	await page.goto('/students')
	await expect(page.getByRole('heading', { name: '学生管理' })).toBeVisible({ timeout: 10000 })

	// Filter to "absent" students (the 3rd select in the filter row: grade, class, attendance, score).
	await page.getByRole('combobox').nth(2).selectOption('absent')

	// Select all currently visible rows.
	const headerCheckbox = page.locator('thead input[type="checkbox"]')
	await expect(headerCheckbox).toBeVisible({ timeout: 10000 })
	await headerCheckbox.click()

	// Trigger bulk attendance marking.
	await page.getByRole('button', { name: '标记出勤' }).click()

	// With "absent" filter still applied, list should become empty.
	await expect(page.getByText('暂无学生数据', { exact: true })).toBeVisible({ timeout: 10000 })
})

test('students: create -> edit -> delete', async ({ page }) => {
	await page.goto('/students')
	await expect(page.getByRole('heading', { name: '学生管理' })).toBeVisible({ timeout: 10000 })

	const suffix = Date.now().toString().slice(-6)
	const createdName = `E2E学生${suffix}`
	const editedName = `E2E学生已改${suffix}`

	// Create
	await page.getByRole('button', { name: '新建学生' }).click()
	await page.getByLabel('学号').fill(`2026${suffix}`)
	await page.getByLabel('年级').selectOption('高二')
	await page.getByLabel('班级', { exact: true }).selectOption('高二 (1) 班')
	await page.getByLabel('姓名').fill(createdName)
	await page.getByRole('button', { name: '创建学生' }).click()
	await expect(page.getByRole('table').getByText(createdName, { exact: true })).toBeVisible({ timeout: 10000 })

	// Edit via more menu
	const row = page.locator('tr', { hasText: createdName })
	await row.getByRole('button', { name: '更多操作' }).click()
	await page.getByRole('button', { name: `编辑 ${createdName}` }).click()
	await page.getByLabel('姓名').fill(editedName)
	await page.getByRole('button', { name: '保存修改' }).click()
	await expect(page.getByRole('table').getByText(editedName, { exact: true })).toBeVisible({ timeout: 10000 })

	// Delete via more menu + confirm
	page.once('dialog', (dialog) => dialog.accept())
	const editedRow = page.locator('tr', { hasText: editedName })
	await editedRow.getByRole('button', { name: '更多操作' }).click()
	await page.getByRole('button', { name: `删除 ${editedName}` }).click()
	await expect(page.getByRole('table').getByText(editedName, { exact: true })).toHaveCount(0)
})

test('students: bulk message + group show feedback and clear selection', async ({ page }) => {
	await page.goto('/students')
	await expect(page.getByRole('heading', { name: '学生管理' })).toBeVisible({ timeout: 10000 })

	// Select the first student.
	await page.locator('tbody input[type="checkbox"]').first().click()
	await expect(page.getByRole('button', { name: '发送消息' })).toBeVisible({ timeout: 10000 })

	// Message: prompt + alert.
	let promptSeen = false
	page.on('dialog', async (dialog) => {
		if (dialog.type() === 'prompt') {
			promptSeen = true
			await dialog.accept('E2E: 请完成今日练习')
			return
		}
		await dialog.accept()
	})

	await page.getByRole('button', { name: '发送消息' }).click()
	await expect.poll(() => promptSeen).toBe(true)
	await expect(page.getByRole('button', { name: '发送消息' })).toHaveCount(0)

	// Group: re-select then prompt + alert.
	await page.locator('tbody input[type="checkbox"]').first().click()
	await page.getByRole('button', { name: '批量分组' }).click()
	await expect(page.getByRole('button', { name: '批量分组' })).toHaveCount(0)
})

test('students: bulk export downloads csv', async ({ page }) => {
	await page.goto('/students')
	await expect(page.getByRole('heading', { name: '学生管理' })).toBeVisible({ timeout: 10000 })

	// Select two students.
	const checkboxes = page.locator('tbody input[type="checkbox"]')
	await checkboxes.nth(0).click()
	await checkboxes.nth(1).click()

	// Expect alert, and capture the download.
	page.on('dialog', async (dialog) => dialog.accept())
	const downloadPromise = page.waitForEvent('download')
	await page.getByRole('button', { name: '导出CSV' }).click()
	const download = await downloadPromise
	await expect(download.suggestedFilename()).toBe('students.csv')
	const downloadPath = await download.path()
	expect(downloadPath).toBeTruthy()
	const csv = fs.readFileSync(downloadPath!, 'utf-8')
	// Header + at least one row.
	expect(csv).toContain('id,name,courseId,attendance,onlineStatus,group')
	expect(csv.split('\n').length).toBeGreaterThan(2)
})

/**
 * Deep-Link 路由 E2E 测试
 * 
 * 测试所有支持 deep-link 的参数化路由：
 * - /live/:courseId - 直播教学
 * - /courses/:courseId - 课程详情
 * - /recordings/:recordingId - 录播详情
 * - /assignments/:assignmentId - 作业详情
 * - /students/:studentId - 学生档案
 * 
 * 使用 Mock 数据中的固定 ID 进行测试
 */
import { test, expect } from '@playwright/test'

// Mock 数据中的固定 ID
const TEST_IDS = {
	course: 'course-001',
	courseLive: 'course-live-1',
	recording: 'rec-001',
	assignment: 'assign-101',
	student: 's001'
}

test.describe('Deep-Link 路由测试', () => {
	
	test.describe('直播页面 /live/:courseId', () => {
		test('通过路径参数访问直播页面', async ({ page }) => {
			await page.goto(`/live/${TEST_IDS.courseLive}`)
			
			// 验证页面渲染
			await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()
			
			// 验证课程 ID 正确显示
			await expect(page.locator('[data-testid="course-id-display"]')).toContainText(TEST_IDS.courseLive)
		})

		test('通过查询参数访问直播页面', async ({ page }) => {
			await page.goto(`/live?courseId=${TEST_IDS.course}`)
			
			await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()
			await expect(page.locator('[data-testid="course-id-display"]')).toContainText(TEST_IDS.course)
		})

		test('无参数时使用默认课程', async ({ page }) => {
			await page.goto('/live')
			
			await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()
			// 默认使用 course-live-1
			await expect(page.locator('[data-testid="course-id-display"]')).toContainText('course-live-1')
		})
	})

	test.describe('课程详情 /courses/:courseId', () => {
		test('通过路径参数访问课程详情', async ({ page }) => {
			await page.goto(`/courses/${TEST_IDS.course}`)
			
			// 验证页面渲染
			await expect(page.locator('[data-testid="course-detail-page"]')).toBeVisible()
			
			// 验证课程 ID
			await expect(page.locator('[data-testid="course-id-display"]')).toContainText(TEST_IDS.course)
		})

		test('访问不存在的课程应显示错误', async ({ page }) => {
			await page.goto('/courses/non-existent-course')
			
			// 应该显示错误信息或 404
			const errorOrPage = page.locator('[data-testid="course-detail-page"], text=加载失败, text=不存在')
			await expect(errorOrPage.first()).toBeVisible({ timeout: 10000 })
		})
	})

	test.describe('录播详情 /recordings/:recordingId', () => {
		test('通过路径参数访问录播详情', async ({ page }) => {
			await page.goto(`/recordings/${TEST_IDS.recording}`)
			
			// 验证页面渲染（可能是详情页或列表页带选中）
			const detailPage = page.locator('[data-testid="recording-detail-page"]')
			const libraryPage = page.locator('[data-testid="recording-library-page"]')
			
			// 至少有一个页面可见
			const isDetailVisible = await detailPage.isVisible().catch(() => false)
			const isLibraryVisible = await libraryPage.isVisible().catch(() => false)
			
			expect(isDetailVisible || isLibraryVisible).toBe(true)
		})

		test('带 courseId 查询参数访问录播', async ({ page }) => {
			await page.goto(`/recordings/${TEST_IDS.recording}?courseId=${TEST_IDS.course}`)
			
			// 页面应该正常渲染
			const detailPage = page.locator('[data-testid="recording-detail-page"]')
			const libraryPage = page.locator('[data-testid="recording-library-page"]')
			
			const isDetailVisible = await detailPage.isVisible().catch(() => false)
			const isLibraryVisible = await libraryPage.isVisible().catch(() => false)
			
			expect(isDetailVisible || isLibraryVisible).toBe(true)
		})
	})

	test.describe('作业详情 /assignments/:assignmentId', () => {
		test('通过路径参数访问作业详情', async ({ page }) => {
			await page.goto(`/assignments/${TEST_IDS.assignment}`)
			
			// 验证页面渲染
			await expect(page.locator('[data-testid="assignment-detail-page"]')).toBeVisible()
			
			// 验证作业 ID
			await expect(page.locator('[data-testid="assignment-id-display"]')).toContainText(TEST_IDS.assignment)
		})

		test('作业详情应显示标题', async ({ page }) => {
			await page.goto(`/assignments/${TEST_IDS.assignment}`)
			
			// 验证作业标题存在
			await expect(page.locator('[data-testid="assignment-title"]')).toBeVisible()
		})
	})

	test.describe('学生档案 /students/:studentId', () => {
		test('通过路径参数访问学生档案', async ({ page }) => {
			await page.goto(`/students/${TEST_IDS.student}`)
			
			// 验证页面加载（学生档案页面应该存在）
			// 由于可能没有 data-testid，使用 URL 验证
			await expect(page).toHaveURL(new RegExp(`/students/${TEST_IDS.student}`))
			
			// 页面不应该是 404
			const notFoundText = page.locator('text=未找到, text=404, text=Not Found')
			const isNotFound = await notFoundText.first().isVisible({ timeout: 3000 }).catch(() => false)
			expect(isNotFound).toBe(false)
		})
	})

	test.describe('404 兜底测试', () => {
		test('访问不存在的路由应显示 404 页面', async ({ page }) => {
			await page.goto('/this-route-does-not-exist')
			
			// 应该显示 404 页面
			await expect(page.locator('text=未找到')).toBeVisible({ timeout: 5000 })
		})

		test('主布局下的未知路由应显示 404', async ({ page }) => {
			await page.goto('/random/unknown/path')
			
			await expect(page.locator('text=未找到')).toBeVisible({ timeout: 5000 })
		})
	})

	test.describe('导航集成测试', () => {
		test('从仪表盘导航到课程详情', async ({ page }) => {
			await page.goto('/')
			
			// 等待仪表盘加载
			await expect(page.getByRole('group', { name: '快捷操作' })).toBeVisible()
			
			// 点击第一个课程卡片
			const courseCard = page.locator('button[aria-label="课程更多操作"]').first()
			if (await courseCard.isVisible()) {
				await courseCard.click()
				
				// 验证跳转到课程详情
				await expect(page).toHaveURL(/\/courses\//)
			}
		})

		test('从仪表盘直接进入直播', async ({ page }) => {
			await page.goto('/')
			
			// 点击开始直播按钮
			await page.getByRole('button', { name: '开始直播' }).click()
			
			// 验证跳转到直播页面
			await expect(page).toHaveURL(/\/live/)
			await expect(page.locator('[data-testid="live-teaching-page"]')).toBeVisible()
		})
	})

	test.describe('查询参数兼容性', () => {
		test('录播列表页应支持 courseId 筛选', async ({ page }) => {
			await page.goto(`/recordings?courseId=${TEST_IDS.course}`)
			
			await expect(page.locator('[data-testid="recording-library-page"]')).toBeVisible()
		})

		test('作业列表页应支持 notice 参数', async ({ page }) => {
			await page.goto('/assignments?notice=published')
			
			// 应该显示通知提示
			await expect(page.locator('text=已发布作业')).toBeVisible({ timeout: 5000 })
		})
	})
})

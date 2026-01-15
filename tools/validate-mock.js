/**
 * tools/validate-mock.js
 *
 * 使用方法：
 *   pnpm node tools/validate-mock.js                 // 默认校验 data/mock/data.json 与 src/data/mock/data.json
 *   pnpm node tools/validate-mock.js <file1> <file2> // 自定义要校验的 mock 文件列表
 *
 * 前置：
 *   pnpm add -D ajv ajv-formats
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import Ajv from 'ajv'
import addFormats from 'ajv-formats'

function readJson(filePath) {
	const raw = fs.readFileSync(filePath, 'utf8')
	try {
		return JSON.parse(raw)
	} catch (e) {
		throw new Error(`Invalid JSON in ${filePath}: ${e.message}`)
	}
}

function formatAjvErrors(errors) {
	if (!errors?.length) return ''
	return errors
		.map((e) => {
			const loc = e.instancePath || '(root)'
			const msg = e.message || 'invalid'
			return `- ${loc} ${msg}`
		})
		.join('\n')
}

async function main() {
	const args = process.argv.slice(2)
	const defaultMockPaths = ['data/mock/data.json', 'src/data/mock/data.json']
	const mockPaths = (args.length ? args : defaultMockPaths).map((p) => path.resolve(process.cwd(), p))

	const schemaDir = path.resolve(process.cwd(), 'spec', 'schemas')
	if (!fs.existsSync(schemaDir)) {
		console.error('Schema directory not found:', schemaDir)
		process.exit(2)
	}

	const ajv = new Ajv({ allErrors: true, strict: false })
	addFormats(ajv)

	// load all schemas in spec/schemas
	for (const fileName of fs.readdirSync(schemaDir).filter((f) => f.endsWith('.json'))) {
		const full = path.join(schemaDir, fileName)
		const schema = readJson(full)
		ajv.addSchema(schema, schema.$id || fileName)
	}

	// map of mock top-level keys -> schema id
	// keys not listed here will be ignored.
	const mapping = {
		users: 'https://example.com/schemas/user.json',
		students: 'https://example.com/schemas/student.json',
		courses: 'https://example.com/schemas/course.json',
		live_sessions: 'https://example.com/schemas/liveSession.json',
		recordings: 'https://example.com/schemas/recording.json',
		problems: 'https://example.com/schemas/problem.json',
		assignments: 'https://example.com/schemas/assignment.json',
		submissions: 'https://example.com/schemas/submission.json',
		dashboard: 'https://example.com/schemas/dashboard.json',
		reports: 'https://example.com/schemas/reportJob.json',
		imports: 'https://example.com/schemas/reportJob.json'
	}

	let failed = false

	for (const mockPath of mockPaths) {
		if (!fs.existsSync(mockPath)) {
			failed = true
			console.error('Mock file not found:', mockPath)
			continue
		}

		const mock = readJson(mockPath)
		console.log(`\nValidating ${mockPath}`)

		for (const [key, schemaId] of Object.entries(mapping)) {
			if (!(key in mock)) continue
			const data = mock[key]
			const validate = ajv.getSchema(schemaId)
			if (!validate) {
				failed = true
				console.error(`[ERROR] schema not loaded: ${schemaId}`)
				continue
			}

			if (Array.isArray(data)) {
				data.forEach((item, idx) => {
					const ok = validate(item)
					if (!ok) {
						failed = true
						console.error(`\n[INVALID] ${key}[${idx}] does not match ${schemaId}`)
						console.error(formatAjvErrors(validate.errors))
					}
				})
			} else {
				const ok = validate(data)
				if (!ok) {
					failed = true
					console.error(`\n[INVALID] ${key} does not match ${schemaId}`)
					console.error(formatAjvErrors(validate.errors))
				}
			}
		}
	}

	if (failed) {
		console.error('\nMock validation failed.')
		process.exit(1)
	}

	console.log('\nMock validation OK.')
}

main().catch((err) => {
	console.error(err)
	process.exit(2)
})

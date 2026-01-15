# API 参考文档（后端接口规范）

> 版本：v1.0
> 更新时间：2026-01-15

本文档提供后端 API 的完整规范，包括请求/响应示例，供后端开发参考实现。

---

## 通用约定

### Base URL

```
生产环境：https://api.campus.example.com/api
开发环境：http://localhost:3000/api
```

### 认证

除登录/注册外，所有接口需在请求头携带 Bearer Token：

```http
Authorization: Bearer <access_token>
```

### 响应格式

成功响应：
```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

错误响应：
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": [
      { "field": "email", "message": "邮箱格式不正确" }
    ]
  }
}
```

### 通用错误码

| 状态码 | 错误码 | 说明 |
|--------|--------|------|
| 400 | VALIDATION_ERROR | 请求参数验证失败 |
| 401 | UNAUTHORIZED | 未认证或 token 过期 |
| 403 | FORBIDDEN | 无权限访问 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突（如重复创建） |
| 500 | INTERNAL_ERROR | 服务器内部错误 |

---

## 认证模块

### POST /api/auth/login

教师登录

**请求体：**
```json
{
  "email": "zhang@example.com",
  "password": "password123"
}
```

**成功响应 (200)：**
```json
{
  "data": {
    "user": {
      "id": "u1",
      "name": "张老师",
      "email": "zhang@example.com",
      "role": "teacher",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2026-01-16T08:00:00+08:00"
  }
}
```

**错误响应 (401)：**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "用户名或密码错误"
  }
}
```

### POST /api/auth/logout

退出登录

**请求头：** 需要 Authorization

**成功响应 (200)：**
```json
{
  "data": { "success": true }
}
```

### POST /api/auth/register

教师注册

**请求体：**
```json
{
  "name": "李老师",
  "email": "li@example.com",
  "password": "securePassword123",
  "inviteCode": "INVITE-2026-ABC"
}
```

**成功响应 (201)：**
```json
{
  "data": {
    "user": {
      "id": "u_new123",
      "name": "李老师",
      "email": "li@example.com",
      "role": "teacher",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2026-01-16T08:00:00+08:00"
  }
}
```

### POST /api/auth/refresh

刷新 Token

**请求头：** 需要 Authorization（使用 refresh token）

**成功响应 (200)：**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2026-01-16T08:00:00+08:00"
  }
}
```

---

## 仪表盘模块

### GET /api/teachers/{id}/dashboard

获取教师仪表盘数据

**路径参数：**
- `id`: 教师 ID

**成功响应 (200)：**
```json
{
  "data": {
    "courses": [
      {
        "id": "course-001",
        "title": "数学竞赛训练 — 高一提升",
        "classLabel": "高一A班",
        "timeRange": "19:00 - 20:30",
        "studentsCount": 32,
        "status": "upcoming"
      }
    ],
    "assignments": [
      {
        "id": "assign-101",
        "courseId": "course-001",
        "title": "第三章：平面几何综合练习",
        "dueAt": "2026-01-15T23:59:00+08:00",
        "status": "published",
        "ungradedCount": 8
      }
    ],
    "metrics": [
      { "key": "participation", "label": "参与率", "value": 92, "unit": "%" },
      { "key": "accuracy", "label": "正确率", "value": 78, "unit": "%" },
      { "key": "hands", "label": "举手数", "value": 5, "unit": "人" }
    ],
    "pendingGradingCount": 25,
    "totalStudents": 97
  }
}
```

---

## 课程模块

### GET /api/courses

获取课程列表

**查询参数：**
- `status` (可选): `live` | `upcoming` | `completed`
- `teacherId` (可选): 教师 ID
- `page` (可选): 页码，默认 1
- `pageSize` (可选): 每页数量，默认 20

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "course-001",
      "title": "数学竞赛训练 — 高一提升",
      "description": "针对高一学生的数学竞赛基础训练课程",
      "teacher": "张老师",
      "teacher_id": "u1",
      "classLabel": "高一A班",
      "schedule": "每周一、三 19:00-20:30",
      "studentsCount": 32,
      "status": "upcoming",
      "stats": {
        "studentsTotal": 32,
        "participationRate": 92,
        "homeworkSubmissionRate": 85
      }
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

### GET /api/courses/{course_id}

获取课程详情

**成功响应 (200)：**
```json
{
  "data": {
    "id": "course-001",
    "title": "数学竞赛训练 — 高一提升",
    "description": "针对高一学生的数学竞赛基础训练课程",
    "teacher": "张老师",
    "teacher_id": "u1",
    "classLabel": "高一A班",
    "schedule": "每周一、三 19:00-20:30",
    "term": "2025-2026学年第二学期",
    "studentsCount": 32,
    "status": "upcoming",
    "chapters": ["数论基础", "同余方程", "平面几何"],
    "stats": {
      "studentsTotal": 32,
      "participationRate": 92,
      "homeworkSubmissionRate": 85
    }
  }
}
```

### POST /api/courses/{course_id}/live/start

开始直播

**成功响应 (200)：**
```json
{
  "data": {
    "id": "live-20260115-001",
    "courseId": "course-001",
    "startAt": "2026-01-15T19:00:00+08:00",
    "status": "live",
    "wsToken": "ws_token_abc123",
    "wsUrl": "wss://live.campus.example.com/live/live-20260115-001/ws"
  }
}
```

### POST /api/live/{live_id}/stop

结束直播

**成功响应 (200)：**
```json
{
  "data": {
    "session": {
      "id": "live-20260115-001",
      "courseId": "course-001",
      "startAt": "2026-01-15T19:00:00+08:00",
      "endAt": "2026-01-15T20:30:00+08:00",
      "status": "ended",
      "durationSeconds": 5400
    },
    "recording": {
      "id": "rec-20260115-001",
      "courseId": "course-001",
      "title": "数学竞赛训练 2026-01-15",
      "status": "processing",
      "createdAt": "2026-01-15T20:30:05+08:00"
    }
  }
}
```

### GET /api/live/{live_id}/stats

获取直播统计

**成功响应 (200)：**
```json
{
  "data": {
    "liveId": "live-20260115-001",
    "participantsCount": 28,
    "peakParticipants": 32,
    "averageWatchTime": 4800,
    "raiseHandCount": 15,
    "questionsAnswered": 8,
    "networkStats": {
      "averageLatency": 45,
      "packetLoss": 0.01
    }
  }
}
```

---

## 作业模块

### GET /api/assignments

获取作业列表

**查询参数：**
- `courseId` (可选): 课程 ID
- `status` (可选): `draft` | `published` | `closed`
- `page` (可选): 页码
- `pageSize` (可选): 每页数量

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "assign-101",
      "courseId": "course-001",
      "title": "第三章：平面几何综合练习",
      "description": "请完成以下题目，注意书写规范",
      "dueAt": "2026-01-15T23:59:00+08:00",
      "totalPoints": 100,
      "status": "published",
      "submissionsCount": 28,
      "ungradedCount": 8,
      "classLabel": "高一A班",
      "createdAt": "2026-01-10T10:00:00+08:00"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "pageSize": 20
  }
}
```

### GET /api/assignments/{id}

获取作业详情（含提交列表）

**成功响应 (200)：**
```json
{
  "data": {
    "id": "assign-101",
    "courseId": "course-001",
    "title": "第三章：平面几何综合练习",
    "description": "请完成以下题目，注意书写规范",
    "dueAt": "2026-01-15T23:59:00+08:00",
    "totalPoints": 100,
    "status": "published",
    "problems": ["p001", "p002"],
    "submissions": [
      {
        "id": "sub-5001",
        "studentId": "s001",
        "studentName": "张三",
        "status": "submitted",
        "submittedAt": "2026-01-13T20:12:00+08:00",
        "grade": null
      }
    ]
  }
}
```

### POST /api/assignments

创建作业

**请求体：**
```json
{
  "courseId": "course-001",
  "title": "新作业标题",
  "description": "作业描述",
  "dueAt": "2026-01-20T23:59:00+08:00",
  "totalPoints": 100,
  "problems": ["p001", "p002"],
  "status": "draft"
}
```

**成功响应 (201)：**
```json
{
  "data": {
    "id": "assign-new-001",
    "courseId": "course-001",
    "title": "新作业标题",
    "status": "draft",
    "createdAt": "2026-01-15T10:00:00+08:00"
  }
}
```

### POST /api/assignments/{id}/grade

提交批改（最终）

**请求体：**
```json
{
  "submissionId": "sub-5001",
  "score": 85,
  "feedback": "解题思路清晰，但书写可以更规范",
  "annotations": [
    {
      "type": "highlight",
      "position": { "page": 1, "x": 100, "y": 200 },
      "comment": "这里推理很好"
    }
  ],
  "voiceCommentUrl": "https://storage.example.com/voice/v123.mp3"
}
```

**成功响应 (200)：**
```json
{
  "data": {
    "gradeId": "g-new-001",
    "submissionId": "sub-5001",
    "score": 85,
    "feedback": "解题思路清晰，但书写可以更规范",
    "gradedAt": "2026-01-15T10:30:00+08:00",
    "notificationSent": true
  }
}
```

### POST /api/assignments/{id}/grade/draft

保存批改草稿

**请求体：**
```json
{
  "submissionId": "sub-5001",
  "score": 80,
  "feedback": "初步批改...",
  "annotations": []
}
```

**成功响应 (200)：**
```json
{
  "data": {
    "draftId": "draft-001",
    "submissionId": "sub-5001",
    "savedAt": "2026-01-15T10:15:00+08:00"
  }
}
```

---

## 学生模块

### GET /api/classes/{id}/students

获取班级学生列表

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "s001",
      "studentNumber": "2026001",
      "name": "张三",
      "avatar": null,
      "grade": "高一",
      "className": "高一A班",
      "group": "A组",
      "onlineStatus": "online",
      "attendance": "present",
      "lastActive": "刚刚"
    }
  ],
  "meta": {
    "total": 32,
    "page": 1,
    "pageSize": 50
  }
}
```

### GET /api/students/{id}/progress

获取学生学习进度

**成功响应 (200)：**
```json
{
  "data": {
    "studentId": "s001",
    "overallScore": 87,
    "scores": [
      { "date": "2025-12-01", "score": 80 },
      { "date": "2025-12-20", "score": 85 },
      { "date": "2026-01-05", "score": 87 }
    ],
    "mastery": {
      "数论": 0.85,
      "几何": 0.72,
      "代数": 0.90
    },
    "attendance": {
      "total": 20,
      "present": 18,
      "rate": 0.9
    },
    "assignments": {
      "total": 10,
      "submitted": 9,
      "averageScore": 85
    }
  }
}
```

---

## 录播模块

### GET /api/recordings

获取录播列表

**查询参数：**
- `courseId` (可选): 课程 ID
- `status` (可选): `processing` | `ready` | `failed`

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "rec-001",
      "courseId": "course-001",
      "title": "数学竞赛训练 2026-01-05",
      "duration": "01:30:00",
      "durationSeconds": 5400,
      "status": "ready",
      "thumbnailUrl": "https://storage.example.com/thumb/rec-001.jpg",
      "playUrl": "https://cdn.example.com/recordings/rec-001.m3u8",
      "createdAt": "2026-01-05T20:30:00+08:00"
    }
  ]
}
```

### GET /api/recordings/{id}

获取录播详情

**成功响应 (200)：**
```json
{
  "data": {
    "id": "rec-001",
    "courseId": "course-001",
    "title": "数学竞赛训练 2026-01-05",
    "duration": "01:30:00",
    "durationSeconds": 5400,
    "status": "ready",
    "thumbnailUrl": "https://storage.example.com/thumb/rec-001.jpg",
    "playUrl": "https://cdn.example.com/recordings/rec-001.m3u8",
    "downloadUrl": "https://cdn.example.com/recordings/rec-001.mp4",
    "chapters": [
      { "time": 0, "title": "开场" },
      { "time": 600, "title": "数论基础" },
      { "time": 2400, "title": "例题讲解" }
    ],
    "viewCount": 45,
    "createdAt": "2026-01-05T20:30:00+08:00"
  }
}
```

---

## 题库模块

### GET /api/problems

获取题目列表

**查询参数：**
- `type` (可选): `subjective` | `single_choice` | `multiple_choice` | `fill_blank`
- `difficulty` (可选): `easy` | `medium` | `hard`
- `status` (可选): `draft` | `published` | `archived` | `pending_review`
- `tags` (可选): 标签（逗号分隔）
- `search` (可选): 搜索关键词

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "p001",
      "title": "数论基本题：整除性判断",
      "type": "subjective",
      "difficulty": "easy",
      "tags": ["数论", "整除"],
      "status": "published",
      "author_id": "u1",
      "createdAt": "2026-01-03T10:00:00+08:00"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "pageSize": 20
  }
}
```

### POST /api/problems

创建题目

**请求体：**
```json
{
  "title": "新题目标题",
  "stem_html": "<p>题目内容...</p>",
  "stem_latex": "x^2 + y^2 = z^2",
  "type": "subjective",
  "difficulty": "medium",
  "tags": ["数论"],
  "knowledge_points": ["整除性"],
  "solution_html": "<p>解答...</p>",
  "hints": ["提示1", "提示2"],
  "status": "draft"
}
```

**成功响应 (201)：**
```json
{
  "data": {
    "id": "p-new-001",
    "title": "新题目标题",
    "status": "draft",
    "createdAt": "2026-01-15T10:00:00+08:00"
  }
}
```

### POST /api/problems/batch-import

批量导入题目

**请求：** `multipart/form-data`
- `file`: Excel/CSV 文件

**成功响应 (200)：**
```json
{
  "data": {
    "jobId": "import-job-001",
    "status": "processing"
  }
}
```

### GET /api/problems/import/{job_id}

获取导入任务状态

**成功响应 (200)：**
```json
{
  "data": {
    "jobId": "import-job-001",
    "status": "completed",
    "progress": 100,
    "imported": 50,
    "failed": 2,
    "errors": [
      { "row": 15, "message": "缺少必填字段：title" },
      { "row": 23, "message": "难度值无效" }
    ],
    "completedAt": "2026-01-15T10:05:00+08:00"
  }
}
```

---

## 通知模块

### GET /api/notifications

获取通知列表

**查询参数：**
- `type` (可选): `assignment` | `course` | `system` | `message`
- `read` (可选): `true` | `false`

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "notif-001",
      "type": "assignment",
      "title": "新作业提交",
      "message": "张三提交了「第三章：平面几何综合练习」",
      "read": false,
      "actionUrl": "/assignments/assign-101",
      "createdAt": "2026-01-13T20:12:00+08:00"
    }
  ]
}
```

### GET /api/notifications/unread-count

获取未读通知数量

**成功响应 (200)：**
```json
{
  "data": {
    "count": 5
  }
}
```

### PATCH /api/notifications/{id}/read

标记通知为已读

**成功响应 (200)：**
```json
{
  "data": { "success": true }
}
```

### POST /api/notifications/mark-all-read

标记所有通知为已读

**成功响应 (200)：**
```json
{
  "data": { "success": true, "updated": 5 }
}
```

---

## 报表模块

### POST /api/reports/generate

生成报表（异步）

**请求体：**
```json
{
  "type": "class_performance",
  "classId": "class-A",
  "dateRange": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "format": "pdf"
}
```

**成功响应 (202)：**
```json
{
  "data": {
    "jobId": "report-job-001",
    "status": "processing",
    "estimatedSeconds": 30
  }
}
```

### GET /api/reports/{job_id}

获取报表状态

**成功响应 (200)：**
```json
{
  "data": {
    "jobId": "report-job-001",
    "status": "ready",
    "progress": 100,
    "downloadUrl": "https://storage.example.com/reports/report-job-001.pdf",
    "expiresAt": "2026-01-22T10:00:00+08:00"
  }
}
```

---

## 文件上传模块

### POST /api/uploads

上传文件

**请求：** `multipart/form-data`
- `file`: 文件
- `type`: `ppt` | `pdf` | `image` | `video` | `audio`
- `courseId` (可选): 关联课程

**成功响应 (200)：**
```json
{
  "data": {
    "mediaId": "media-001",
    "url": "https://storage.example.com/uploads/file.pdf",
    "filename": "讲义.pdf",
    "size": 2048000,
    "mimeType": "application/pdf"
  }
}
```

### GET /api/media/{id}

获取媒体信息

**成功响应 (200)：**
```json
{
  "data": {
    "id": "media-001",
    "url": "https://storage.example.com/uploads/file.pdf",
    "filename": "讲义.pdf",
    "size": 2048000,
    "mimeType": "application/pdf",
    "createdAt": "2026-01-10T10:00:00+08:00"
  }
}
```

---

## 长事务状态约定

对于导入、报表生成、录制转码等长时间运行的任务，统一返回以下字段：

```json
{
  "jobId": "job-xxx",
  "status": "pending" | "processing" | "completed" | "failed",
  "progress": 0-100,
  "error": null | { "code": "...", "message": "..." },
  "result": { ... },
  "createdAt": "...",
  "updatedAt": "..."
}
```

建议轮询策略：
- 初始间隔：2 秒
- 最大间隔：10 秒
- 指数退避：2s → 4s → 8s → 10s（固定）
- 最大重试：60 次（约 10 分钟）

---

## WebSocket 实时通信

详见 `spec/ws-live.md`

连接地址：`wss://{host}/live/{live_id}/ws?token={session_token}`

支持事件：
- `join` / `joined`
- `whiteboard:update` / `whiteboard:patch`
- `raise_hand`
- `question:open` / `answer`
- `recording:status`
- `ping` / `pong`

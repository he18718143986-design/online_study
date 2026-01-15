# API 请求/响应示例

本文档提供前端调用后端 API 的具体请求/响应示例，便于后端开发参考和前端 mock 数据对照。

---

## 认证模块

### 登录

**请求:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "zhang@example.com",
  "password": "password123"
}
```

**响应 (200 OK):**
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1MSIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzA1MzEyMDAwLCJleHAiOjE3MDUzOTg0MDB9.xxx",
    "expiresAt": "2026-01-16T08:00:00+08:00"
  }
}
```

**响应 (401 Unauthorized):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "用户名或密码错误"
  }
}
```

---

## 仪表盘模块

### 获取仪表盘数据

**请求:**
```http
GET /api/teachers/u1/dashboard
Authorization: Bearer <token>
```

**响应 (200 OK):**
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
      },
      {
        "id": "course-002",
        "title": "初三奥数集训营",
        "classLabel": "初三集训",
        "timeRange": "14:00 - 16:00",
        "studentsCount": 40,
        "status": "live"
      }
    ],
    "assignments": [
      {
        "id": "assign-101",
        "courseId": "course-001",
        "title": "第三章：平面几何综合练习",
        "dueAt": "2026-01-15T23:59:00+08:00",
        "status": "published",
        "submissionsCount": 28,
        "ungradedCount": 8,
        "classLabel": "高一A班"
      }
    ],
    "metrics": [
      { "key": "participation", "label": "参与率", "value": 92, "unit": "%" },
      { "key": "accuracy", "label": "正确率", "value": 78, "unit": "%" },
      { "key": "hands", "label": "举手数", "value": 5, "unit": "人" }
    ]
  }
}
```

---

## 课程模块

### 获取课程列表

**请求:**
```http
GET /api/courses?teacherId=u1&status=upcoming&page=1&pageSize=20
Authorization: Bearer <token>
```

**响应 (200 OK):**
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
    "total": 3,
    "page": 1,
    "pageSize": 20
  }
}
```

### 开始直播

**请求:**
```http
POST /api/courses/course-001/live/start
Authorization: Bearer <token>
```

**响应 (200 OK):**
```json
{
  "data": {
    "id": "live-20260115-001",
    "courseId": "course-001",
    "startAt": "2026-01-15T19:00:00+08:00",
    "status": "live",
    "wsToken": "ws_token_abc123xyz",
    "wsUrl": "wss://live.campus.example.com/live/live-20260115-001/ws"
  }
}
```

### 结束直播

**请求:**
```http
POST /api/live/live-20260115-001/stop
Authorization: Bearer <token>
```

**响应 (200 OK):**
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

---

## 作业模块

### 获取作业列表

**请求:**
```http
GET /api/assignments?courseId=course-001&status=published
Authorization: Bearer <token>
```

**响应 (200 OK):**
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
    "total": 4,
    "page": 1,
    "pageSize": 20
  }
}
```

### 创建作业

**请求:**
```http
POST /api/assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course-001",
  "title": "第五章：组合数学入门",
  "description": "完成组合数学基础练习",
  "dueAt": "2026-01-25T23:59:00+08:00",
  "totalPoints": 100,
  "problems": ["p001", "p002", "p003"],
  "status": "draft"
}
```

**响应 (201 Created):**
```json
{
  "data": {
    "id": "assign-105",
    "courseId": "course-001",
    "title": "第五章：组合数学入门",
    "status": "draft",
    "createdAt": "2026-01-15T10:00:00+08:00"
  }
}
```

### 提交批改

**请求:**
```http
POST /api/assignments/assign-101/grade
Authorization: Bearer <token>
Content-Type: application/json

{
  "submissionId": "sub-5001",
  "score": 85,
  "feedback": "解题思路清晰，但书写需要更规范。第二题的证明过程可以更简洁。",
  "annotations": [
    {
      "type": "highlight",
      "position": { "page": 1, "x": 100, "y": 200, "width": 150, "height": 30 },
      "comment": "推理过程很好"
    },
    {
      "type": "correction",
      "position": { "page": 1, "x": 200, "y": 350, "width": 100, "height": 20 },
      "comment": "这里应该是 n(n-1)/2"
    }
  ],
  "voiceCommentUrl": null
}
```

**响应 (200 OK):**
```json
{
  "data": {
    "gradeId": "g-001",
    "submissionId": "sub-5001",
    "score": 85,
    "feedback": "解题思路清晰，但书写需要更规范。第二题的证明过程可以更简洁。",
    "gradedAt": "2026-01-15T10:30:00+08:00",
    "notificationSent": true
  }
}
```

---

## 学生模块

### 获取班级学生列表

**请求:**
```http
GET /api/classes/class-A/students
Authorization: Bearer <token>
```

**响应 (200 OK):**
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
    },
    {
      "id": "s002",
      "studentNumber": "2026002",
      "name": "李四",
      "avatar": null,
      "grade": "高一",
      "className": "高一A班",
      "group": "A组",
      "onlineStatus": "offline",
      "attendance": "absent",
      "lastActive": "2小时前"
    }
  ],
  "meta": {
    "total": 32,
    "page": 1,
    "pageSize": 50
  }
}
```

### 获取学生学习进度

**请求:**
```http
GET /api/students/s001/progress
Authorization: Bearer <token>
```

**响应 (200 OK):**
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
      "代数": 0.90,
      "组合": 0.68
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

### 获取录播列表

**请求:**
```http
GET /api/recordings?courseId=course-001&status=ready
Authorization: Bearer <token>
```

**响应 (200 OK):**
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

### 获取录播详情（含章节）

**请求:**
```http
GET /api/recordings/rec-001
Authorization: Bearer <token>
```

**响应 (200 OK):**
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
      { "time": 0, "title": "开场与回顾" },
      { "time": 300, "title": "数论基础概念" },
      { "time": 1200, "title": "例题讲解：整除性" },
      { "time": 2700, "title": "练习与答疑" },
      { "time": 4500, "title": "总结与预告" }
    ],
    "viewCount": 45,
    "createdAt": "2026-01-05T20:30:00+08:00"
  }
}
```

---

## 文件上传模块

### 上传文件

**请求:**
```http
POST /api/uploads
Authorization: Bearer <token>
Content-Type: multipart/form-data

------boundary
Content-Disposition: form-data; name="file"; filename="讲义.pdf"
Content-Type: application/pdf

<binary data>
------boundary
Content-Disposition: form-data; name="type"

document
------boundary
Content-Disposition: form-data; name="courseId"

course-001
------boundary--
```

**响应 (200 OK):**
```json
{
  "data": {
    "mediaId": "media-001",
    "url": "https://storage.example.com/uploads/2026/01/讲义-abc123.pdf",
    "filename": "讲义.pdf",
    "size": 2048000,
    "mimeType": "application/pdf"
  }
}
```

---

## 通知模块

### 获取通知列表

**请求:**
```http
GET /api/notifications?read=false
Authorization: Bearer <token>
```

**响应 (200 OK):**
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
    },
    {
      "id": "notif-003",
      "type": "course",
      "title": "课程即将开始",
      "message": "「初三奥数集训营」将于30分钟后开始",
      "read": false,
      "actionUrl": "/courses/course-002",
      "createdAt": "2026-01-12T13:30:00+08:00"
    }
  ]
}
```

### 标记通知为已读

**请求:**
```http
PATCH /api/notifications/notif-001/read
Authorization: Bearer <token>
```

**响应 (200 OK):**
```json
{
  "data": { "success": true }
}
```

---

## Mock 数据映射

前端 mock 数据文件位于 `src/data/mock/data.json`，其结构与上述 API 响应保持一致。

### 字段映射表

| API 字段 | Mock 字段 | 说明 |
|---------|----------|------|
| `user.id` | `users[].id` | 用户 ID |
| `course.status` | `courses[].status` | 课程状态：`live` / `upcoming` / `completed` |
| `assignment.status` | `assignments[].status` | 作业状态：`draft` / `published` / `closed` |
| `recording.status` | `recordings[].status` | 录播状态：`processing` / `ready` / `failed` |
| `student.onlineStatus` | `students[].onlineStatus` | 在线状态：`online` / `offline` / `idle` |
| `student.attendance` | `students[].attendance` | 出勤状态：`present` / `absent` / `late` |

### 环境切换

通过环境变量 `VITE_USE_MOCK` 控制：
- `true`：使用本地 mock 数据
- `false`：调用真实后端 API

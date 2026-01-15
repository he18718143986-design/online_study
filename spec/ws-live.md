# Live WebSocket 协议规范（简明版）

用途：教师端/学生端用于直播白板、互动、举手、出勤与录制事件的实时通道协议。

## 连接地址

`wss://{host}/live/{live_id}/ws?token={session_token}`

- `live_id`：直播会话 ID（来自 `POST /courses/{course_id}/live/start`）
- `session_token`：短期有效的连接令牌（后端颁发）

## 连接握手

客户端连接后必须发送 `join` 事件：

```json
{
  "type": "join",
  "seq": 1,
  "payload": {
    "liveId": "live-9001",
    "userId": "u1",
    "role": "teacher",
    "displayName": "张老师"
  }
}
```

后端回应 `joined`：

```json
{
  "type": "joined",
  "ack_seq": 1,
  "payload": {
    "participants": [{ "userId": "u1", "role": "teacher", "status": "present" }],
    "snapshotVersion": 42
  }
}
```

## 消息设计（通用字段）

- `type`（必需）：字符串事件类型，如 `whiteboard:patch`
- `seq`（客户端发送建议携带）：递增序号
- `ack_seq`（服务器应答可选）：表示已处理到哪个 seq
- `payload`：事件具体内容
- `ts`（可选）：ISO 时间戳

所有事件以 JSON 文本形式发送（UTF-8）。

## 核心事件（双向）

### 客户端 -> 服务器

- `join`：加入直播通道
- `leave`：离开（可选）

- `whiteboard:update`：白板操作 patch（应包含 seq）

```json
{ "type": "whiteboard:update", "seq": 123, "payload": { "ops": [{ "op": "draw", "path": [] }] } }
```

- `raise_hand`：举手

```json
{ "type": "raise_hand", "seq": 21, "payload": { "userId": "s444", "timestamp": "2026-01-12T14:10:00+08:00" } }
```

- `answer`：互动题作答

```json
{ "type": "answer", "seq": 50, "payload": { "questionId": "q1", "userId": "s444", "answer": "A" } }
```

- `ping`：心跳（服务端回 `pong`）

### 服务器 -> 客户端

- `joined`：join 成功并返回参与者列表与 `snapshotVersion`

- `participant:update`：有人加入/离开/状态变化

```json
{ "type": "participant:update", "payload": { "userId": "s444", "status": "raised" } }
```

- `whiteboard:patch`：广播白板 patch（包含 seq）
- `question:open`：打开一道互动题（客户端渲染）
- `recording:status`：录制/转码状态变更 `{ recordingId, status }`
- `pong`：心跳响应

## 序号（seq/ack）与快照策略

- 客户端对“非幂等操作”发送 `seq`（自增），服务器通过 `ack_seq` 告知已消费到哪个 seq。
- 若客户端发现接收方的 `snapshotVersion` 与本地不同步，应请求 `whiteboard:snapshot` 或重新加载页面。
- 建议：在 `joined` 响应中携带 `snapshotVersion`；若 seq 丢失严重，触发 snapshot 恢复。

## 心跳与重连策略

- 心跳：客户端定期发送 `ping`（默认 15s）；服务器须回 `pong`。
- 重连：
  - 网络断开时开始指数退避：2s, 5s, 10s, 20s, 40s（上限 60s）
  - 重连成功后应执行 `join`
  - 尝试 6 次若失败，展示“离线”并允许用户手动重连
- 数据补偿：重连成功后根据 `ack_seq` / `snapshotVersion` 决定是否重发未 ack 消息或请求 snapshot。

## 录制事件与转码通知

当直播结束并触发录制，服务端发送 `recording:status`：

```json
{ "type": "recording:status", "payload": { "recordingId": "rec-1234", "status": "processing", "progress": 15 } }
```

状态轮转：`processing` → `ready` | `failed`。

## 错误码约定（应用层）

消息可以包含应用层 `error`：

```json
{ "type": "error", "code": 4001, "message": "Invalid token" }
```

常用 code：

- `4001`：InvalidToken
- `4002`：PermissionDenied
- `5001`：InternalServerError
- `5002`：SnapshotUnavailable

## 示例完整流程（教师开始直播）

1. 教师点击“开始直播” → 后端创建 live 会话，返回 `live_id` + `token`
2. 教师端连接 `wss://.../live/{live_id}/ws?token=...` 并发送 `join`
3. 后端回 `joined`（带 `snapshotVersion / participants`）
4. 教师白板操作发送 `whiteboard:update`；服务器广播 `whiteboard:patch`
5. 结束直播时服务器触发录制创建并广播 `recording:status`（processing）
6. 转码完成后服务器广播 `recording:status`（ready），前端展示回放入口

## 安全与认证

- WebSocket 必须使用 TLS（`wss://`）
- token 建议短时有效，并在后端校验用户权限
- 对所有来自客户端的事件进行权限校验（谁能发白板 ops，谁能结束直播等）

## 调试建议

- 后端实现中保留 `debug` 模式，能记录 `seq / payload` 并回放合成 `whiteboard:patch`
- 前端在 dev 下可提供 mock ws server（可用 `ws` npm 包）模拟事件流

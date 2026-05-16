# Notification System Design

## Objective

Design REST APIs and real-time notification architecture for a campus notification platform that supports:

- Placements
- Events
- Results

The system supports:

- Notification retrieval
- Notification filtering
- Mark as read/unread
- Real-time updates
- Pagination
- Notification prioritization

---

## API Design

Base URL:

```
/api/v1
```

### Notification Object Schema

```json
{
  "id": "uuid",
  "studentId": "uuid",
  "type": "Placement",
  "title": "CSX Corporation Hiring",
  "message": "CSX Corporation is hiring for Software Engineer role",
  "priority": "HIGH",
  "isRead": false,
  "createdAt": "2026-04-22T17:51:18Z",
  "updatedAt": "2026-04-22T17:51:18Z"
}
```

### Endpoints

1. Get Notifications

```
GET /notifications
```

Query Parameters:

- page: number
- limit: number
- type: Event | Result | Placement
- isRead: boolean
- priority: HIGH | MEDIUM | LOW

Sample Response:

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 120,
  "notifications": [
    {
      "id": "123",
      "type": "Placement",
      "title": "Amazon Hiring",
      "message": "Amazon hiring for SDE",
      "priority": "HIGH",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:18Z"
    }
  ]
}
```

2. Get Notification by ID

```
GET /notifications/{id}
```

3. Mark Notification as Read

```
PATCH /notifications/{id}/read
```

Request:

```json
{ "isRead": true }
```

4. Mark Multiple Notifications as Read

```
PATCH /notifications/read-all
```

Request:

```json
{ "notificationIds": ["1", "2", "3"] }
```

5. Delete Notification

```
DELETE /notifications/{id}
```

### HTTP Status Codes

- 200 Success
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

---

## Real-Time Notification Mechanism

Use WebSockets for real-time notifications.

### Client Subscribe

```json
{ "event": "subscribe", "studentId": "123" }
```

### Server Push

```json
{
  "event": "new_notification",
  "data": {
    "id": "456",
    "type": "Placement",
    "message": "Google Hiring"
  }
}
```

---

## Database Design (PostgreSQL)

### Schema

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(255),
  message TEXT,
  priority VARCHAR(10),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes

```sql
CREATE INDEX idx_student_id ON notifications(student_id);
CREATE INDEX idx_is_read ON notifications(is_read);
CREATE INDEX idx_created_at ON notifications(created_at);
CREATE INDEX idx_type ON notifications(type);
CREATE INDEX idx_student_read_created ON notifications(student_id, is_read, created_at DESC);
```

### Example Queries

Fetch notifications (paginated):

```sql
SELECT *
FROM notifications
WHERE student_id = '123'
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

Mark as read:

```sql
UPDATE notifications
SET is_read = true
WHERE id = '123';
```

Delete:

```sql
DELETE FROM notifications
WHERE id = '123';
```

---

## Scaling and Optimization Notes

- Use composite indexes for frequent filters and sort fields.
- Always paginate to avoid full-table scans.
- Partition by student_id or time ranges at high scale.
- Use Redis caching for hot unread feeds.

### Optimized Query Example

```sql
SELECT id, type, message, created_at
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at DESC
LIMIT 50;
```

# Campus Notification System

Full stack notification platform for placements, events, and results with real-time updates.

## Repository structure

- logging_middleware/
- notification_system_design.md
- notification_app_be/
- notification_app_fe/
- context/

## Backend setup (Express)

```bash
cd notification_app_be
npm install
cp .env.example .env
```

Create schema in Postgres (run once):

```bash
psql "$DATABASE_URL" -f migrations/create_notifications.sql
```

Run the API:

```bash
npm start
```

Note: set `AUTH_REQUIRED=0` in notification_app_be/.env for local testing without a token.

### API endpoints

- GET /api/v1/notifications
- GET /api/v1/notifications/:id
- PATCH /api/v1/notifications/:id/read
- PATCH /api/v1/notifications/read-all
- DELETE /api/v1/notifications/:id
- POST /api/v1/notifications/seed (helper)

### WebSocket

- connect to the server base URL
- emit:

```json
{ "event": "subscribe", "studentId": "<uuid>" }
```

- server event:

```json
{ "event": "new_notification", "data": { "id": "..." } }
```

## Frontend setup (React + Vite)

```bash
cd notification_app_fe
npm install
cp .env.example .env
npm run dev
```

Open: http://localhost:3000

## Logging middleware

Use Log() from logging_middleware/ for both backend and frontend logging.

```js
const { Log } = require("../logging_middleware");
Log("backend", "info", "route", "GET /api/v1/notifications");
```

## Registration & auth (test server)

Register:

```bash
curl -X POST http://4.224.186.213/evaluation-service/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@college.edu",
    "name": "Your Name",
    "mobileNo": "9999999999",
    "githubUsername": "your-github",
    "rollNo": "your-roll",
    "accessCode": "your-access-code"
  }'
```

Auth token:

```bash
curl -X POST http://4.224.186.213/evaluation-service/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@college.edu",
    "name": "Your Name",
    "rollNo": "your-roll",
    "accessCode": "your-access-code",
    "clientID": "<client-id>",
    "clientSecret": "<client-secret>"
  }'
```

Paste the token into the frontend "Access Token" field.

## Tests

```bash
cd notification_app_be
npm test
```

Note: tests are skipped unless DATABASE_URL is set.

## Screenshots checklist

API (Postman/Insomnia):

- GET /notifications (with filters + pagination)
- GET /notifications/:id
- PATCH /notifications/:id/read
- PATCH /notifications/read-all
- DELETE /notifications/:id

Each screenshot must show request body, response, and response time.

UI:

- Desktop view
- Mobile view

## Performance and scaling notes

- Use composite indexes to speed up student + read + createdAt queries.
- Always paginate results; avoid full-table scans.
- Add caching for hot feeds if volume grows.
- Consider partitioning by created_at for very large datasets.

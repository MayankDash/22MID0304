# Notification App - Backend

Backend scaffold for the notification system. This is a minimal Express application implementing the API design from the exam spec.

Quick start

1. Install dependencies

```bash
cd notification_app_be
npm install
```

2. Configure environment

```bash
cp .env.example .env
```

3. Run the server

```bash
npm start
```

5. Run tests

```bash
npm test
```

4. Useful endpoints

- `GET /api/v1/notifications`
- `GET /api/v1/notifications/:id`
- `PATCH /api/v1/notifications/:id/read`
- `PATCH /api/v1/notifications/read-all`
- `DELETE /api/v1/notifications/:id`
- `POST /api/v1/notifications/seed` (create sample notification)

Notes

- Create the schema using `migrations/create_notifications.sql` before running the API.
- Logging middleware posts logs to the evaluation server by default. Disable remote logging with `DISABLE_REMOTE_LOG=1`.
- Set `AUTH_REQUIRED=1` to enforce `Authorization: Bearer <token>` on API calls.

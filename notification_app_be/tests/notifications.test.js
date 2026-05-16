const request = require("supertest");
const { app } = require("../src/index");
const { pool } = require("../src/config/db");

const describeDb = process.env.DATABASE_URL ? describe : describe.skip;

describeDb("Notifications API", () => {
  beforeAll(async () => {
    process.env.AUTH_REQUIRED = "0";
    await pool.query(
      `CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY,
        student_id UUID NOT NULL,
        type VARCHAR(20) NOT NULL,
        title VARCHAR(255),
        message TEXT,
        priority VARCHAR(10),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
    );
    await pool.query("DELETE FROM notifications");
  });

  afterAll(async () => {
    await pool.end();
  });

  test("creates and lists notifications", async () => {
    const createRes = await request(app)
      .post("/api/v1/notifications/seed")
      .send({
        type: "Placement",
        title: "Test",
        message: "Test message",
        priority: "HIGH",
      })
      .expect(201);

    expect(createRes.body.success).toBe(true);
    const listRes = await request(app)
      .get("/api/v1/notifications?page=1&limit=10")
      .expect(200);

    expect(listRes.body.success).toBe(true);
    expect(listRes.body.total).toBeGreaterThan(0);
    expect(Array.isArray(listRes.body.notifications)).toBe(true);
  });
});

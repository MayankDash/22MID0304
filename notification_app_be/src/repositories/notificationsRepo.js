const { query } = require("../config/db");

function mapRow(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    type: row.type,
    title: row.title,
    message: row.message,
    priority: row.priority,
    isRead: row.is_read,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : row.updated_at,
  };
}

async function listNotifications({ page, limit, type, isRead, priority }) {
  const filters = [];
  const values = [];

  if (type) {
    values.push(type);
    filters.push(`type = $${values.length}`);
  }
  if (typeof isRead === "boolean") {
    values.push(isRead);
    filters.push(`is_read = $${values.length}`);
  }
  if (priority) {
    values.push(priority);
    filters.push(`priority = $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM notifications ${whereClause}`,
    values,
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const offset = (page - 1) * limit;
  const dataValues = values.slice();
  dataValues.push(limit);
  dataValues.push(offset);

  const limitIndex = dataValues.length - 1;
  const offsetIndex = dataValues.length;
  const dataQuery =
    `SELECT * FROM notifications ${whereClause} ` +
    `ORDER BY created_at DESC LIMIT $${limitIndex} OFFSET $${offsetIndex}`;
  const dataResult = await query(dataQuery, dataValues);

  return { total, rows: dataResult.rows.map(mapRow) };
}

async function getById(id) {
  const result = await query("SELECT * FROM notifications WHERE id = $1", [id]);
  if (!result.rows.length) return null;
  return mapRow(result.rows[0]);
}

async function createNotification(data) {
  const result = await query(
    `INSERT INTO notifications
     (id, student_id, type, title, message, priority, is_read, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING *`,
    [
      data.id,
      data.studentId,
      data.type,
      data.title,
      data.message,
      data.priority,
      data.isRead,
    ],
  );
  return mapRow(result.rows[0]);
}

async function updateRead(id, isRead) {
  const result = await query(
    "UPDATE notifications SET is_read = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [isRead, id],
  );
  if (!result.rows.length) return null;
  return mapRow(result.rows[0]);
}

async function updateMultipleRead(ids) {
  if (!ids.length) return 0;
  const result = await query(
    "UPDATE notifications SET is_read = TRUE, updated_at = NOW() WHERE id = ANY($1::uuid[]) AND is_read = FALSE",
    [ids],
  );
  return result.rowCount || 0;
}

async function deleteById(id) {
  const result = await query("DELETE FROM notifications WHERE id = $1", [id]);
  return result.rowCount || 0;
}

module.exports = {
  listNotifications,
  getById,
  createNotification,
  updateRead,
  updateMultipleRead,
  deleteById,
};

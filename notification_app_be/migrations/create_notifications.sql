-- Create notifications table (Postgres)
CREATE TABLE IF NOT EXISTS notifications (
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

-- Indexes recommended in design
CREATE INDEX IF NOT EXISTS idx_student_id ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_student_read_created ON notifications(student_id, is_read, created_at DESC);

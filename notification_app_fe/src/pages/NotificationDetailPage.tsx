import { Box, Button, Chip, Stack, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  deleteNotification,
  getNotificationById,
  markNotificationRead,
  NotificationItem,
} from "../api/notifications";

function NotificationDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<NotificationItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getNotificationById(id)
      .then((response) => setItem(response.notification))
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleToggleRead() {
    if (!item) return;
    await markNotificationRead(item.id, !item.isRead);
    setItem({ ...item, isRead: !item.isRead });
  }

  async function handleDelete() {
    if (!item) return;
    await deleteNotification(item.id);
    window.location.href = "/";
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!item) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #f0e3d5",
        background: "#fff8f0",
        animation: "fadeUp 600ms ease",
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={item.type} color="primary" />
          <Chip label={item.priority} color="secondary" />
          <Chip label={item.isRead ? "Read" : "Unread"} variant="outlined" />
        </Stack>

        <Typography variant="h5">{item.title}</Typography>
        <Typography>{item.message}</Typography>
        <Typography sx={{ opacity: 0.6, fontSize: 13 }}>
          {new Date(item.createdAt).toLocaleString()}
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="outlined" component={Link} to="/">
            Back to list
          </Button>
          <Button variant="contained" onClick={handleToggleRead}>
            Mark {item.isRead ? "Unread" : "Read"}
          </Button>
          <Button variant="text" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default NotificationDetailPage;

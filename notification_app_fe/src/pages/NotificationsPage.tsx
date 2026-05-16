import {
  Alert,
  Badge,
  Box,
  Button,
  Pagination,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  deleteNotification,
  markNotificationRead,
  markNotificationsRead,
  NotificationItem,
} from "../api/notifications";
import FilterBar from "../components/FilterBar";
import NotificationList from "../components/NotificationList";
import { useNotifications } from "../hooks/useNotifications";

function NotificationsPage() {
  const {
    data,
    total,
    loading,
    error,
    page,
    limit,
    type,
    priority,
    isRead,
    studentId,
    liveMessage,
    setPage,
    setType,
    setPriority,
    setIsRead,
    setStudentId,
    setLiveMessage,
    refresh,
  } = useNotifications();

  const [actionError, setActionError] = useState<string | null>(null);

  const unreadCount = useMemo(
    () => data.filter((item) => !item.isRead).length,
    [data],
  );

  async function handleToggleRead(item: NotificationItem) {
    try {
      await markNotificationRead(item.id, !item.isRead);
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  }

  async function handleDelete(item: NotificationItem) {
    try {
      await deleteNotification(item.id);
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  }

  async function handleMarkAllRead() {
    try {
      const ids = data.filter((item) => !item.isRead).map((item) => item.id);
      if (!ids.length) return;
      await markNotificationsRead(ids);
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          background: "#fff8f0",
          border: "1px solid #f0e3d5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack>
          <Typography variant="h6">Notification Feed</Typography>
          <Typography sx={{ opacity: 0.7 }}>
            Live updates as placements, events, and results drop.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Badge color="secondary" badgeContent={unreadCount}>
            <Typography>Unread</Typography>
          </Badge>
          <Button variant="contained" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        </Stack>
      </Box>

      <FilterBar
        type={type}
        priority={priority}
        isRead={isRead}
        studentId={studentId}
        onTypeChange={(value) => {
          setPage(1);
          setType(value);
        }}
        onPriorityChange={(value) => {
          setPage(1);
          setPriority(value);
        }}
        onIsReadChange={(value) => {
          setPage(1);
          setIsRead(value);
        }}
        onStudentIdChange={setStudentId}
      />

      <NotificationList
        items={data}
        loading={loading}
        error={error}
        onToggleRead={handleToggleRead}
        onDelete={handleDelete}
      />

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Snackbar
        open={Boolean(liveMessage)}
        autoHideDuration={2500}
        onClose={() => setLiveMessage(null)}
      >
        <Alert severity="info">{liveMessage}</Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(actionError)}
        autoHideDuration={2500}
        onClose={() => setActionError(null)}
      >
        <Alert severity="error">{actionError}</Alert>
      </Snackbar>
    </Stack>
  );
}

export default NotificationsPage;

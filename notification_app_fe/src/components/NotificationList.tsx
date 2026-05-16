import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { NotificationItem } from "../api/notifications";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
  items: NotificationItem[];
  loading: boolean;
  error: string | null;
  onToggleRead: (item: NotificationItem) => void;
  onDelete: (item: NotificationItem) => void;
}

function NotificationList({
  items,
  loading,
  error,
  onToggleRead,
  onDelete,
}: NotificationListProps) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!items.length) {
    return (
      <Box sx={{ p: 4, textAlign: "center", opacity: 0.7 }}>
        <Typography variant="h6">No notifications yet</Typography>
        <Typography>Try adjusting filters or check back later.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      {items.map((item) => (
        <NotificationCard
          key={item.id}
          item={item}
          onToggleRead={onToggleRead}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}

export default NotificationList;

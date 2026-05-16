import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { NotificationItem } from "../api/notifications";

interface NotificationCardProps {
  item: NotificationItem;
  onToggleRead: (item: NotificationItem) => void;
  onDelete: (item: NotificationItem) => void;
}

function NotificationCard({
  item,
  onToggleRead,
  onDelete,
}: NotificationCardProps) {
  const date = new Date(item.createdAt).toLocaleString();

  return (
    <Card
      sx={{
        animation: "fadeUp 700ms ease",
        transition: "transform 0.2s ease",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={item.type}
              size="small"
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={item.priority}
              size="small"
              color={item.priority === "HIGH" ? "secondary" : "default"}
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={item.isRead ? "Read" : "Unread"}
              size="small"
              variant="outlined"
            />
          </Stack>

          <Box>
            <Typography variant="h6">{item.title}</Typography>
            <Typography sx={{ opacity: 0.8 }}>{item.message}</Typography>
            <Typography sx={{ mt: 1, fontSize: 12, opacity: 0.6 }}>
              {date}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              component={Link}
              to={`/notifications/${item.id}`}
            >
              View Details
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => onToggleRead(item)}
            >
              Mark {item.isRead ? "Unread" : "Read"}
            </Button>
            <Button variant="text" color="error" onClick={() => onDelete(item)}>
              Delete
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default NotificationCard;

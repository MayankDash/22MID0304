import { useCallback, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  listNotifications,
  NotificationItem,
  NotificationPriority,
  NotificationType,
} from "../api/notifications";
import { getSocketUrl } from "../api/client";

export function useNotifications() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [type, setType] = useState<NotificationType | "">("");
  const [priority, setPriority] = useState<NotificationPriority | "">("");
  const [isRead, setIsRead] = useState<boolean | null>(null);
  const [studentId, setStudentId] = useState("");

  const [data, setData] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState<string | null>(null);

  const filters = useMemo(
    () => ({ page, limit, type, priority, isRead }),
    [page, limit, type, priority, isRead],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listNotifications({
        page,
        limit,
        type: type || undefined,
        priority: priority || undefined,
        isRead,
      });
      setData(response.notifications);
      setTotal(response.total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, type, priority, isRead]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    let socket: Socket | null = null;
    try {
      socket = io(getSocketUrl(), { transports: ["websocket"] });
      if (studentId) {
        socket.emit("subscribe", { studentId });
      }
      socket.on("new_notification", (payload: { data?: NotificationItem }) => {
        setLiveMessage(payload?.data?.title || "New notification received");
        refresh();
      });
    } catch (err) {
      // ignore socket errors in UI
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [refresh, studentId]);

  return {
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
    setLimit,
    setType,
    setPriority,
    setIsRead,
    setStudentId,
    setLiveMessage,
    refresh,
  };
}

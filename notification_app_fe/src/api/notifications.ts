import { apiRequest } from "./client";

export type NotificationType = "Placement" | "Event" | "Result";
export type NotificationPriority = "HIGH" | "MEDIUM" | "LOW";

export interface NotificationItem {
  id: string;
  studentId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationListResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  notifications: NotificationItem[];
}

export async function listNotifications(params: {
  page: number;
  limit: number;
  type?: string;
  priority?: string;
  isRead?: boolean | null;
}) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.type) search.set("type", params.type);
  if (params.priority) search.set("priority", params.priority);
  if (typeof params.isRead === "boolean") {
    search.set("isRead", String(params.isRead));
  }

  return apiRequest<NotificationListResponse>(
    `/notifications?${search.toString()}`,
  );
}

export async function getNotificationById(id: string) {
  return apiRequest<{ success: boolean; notification: NotificationItem }>(
    `/notifications/${id}`,
  );
}

export async function markNotificationRead(id: string, isRead: boolean) {
  return apiRequest<{ success: boolean; message: string }>(
    `/notifications/${id}/read`,
    {
      method: "PATCH",
      body: JSON.stringify({ isRead }),
    },
  );
}

export async function markNotificationsRead(ids: string[]) {
  return apiRequest<{ success: boolean; updatedCount: number }>(
    "/notifications/read-all",
    {
      method: "PATCH",
      body: JSON.stringify({ notificationIds: ids }),
    },
  );
}

export async function deleteNotification(id: string) {
  return apiRequest<{ success: boolean; message: string }>(
    `/notifications/${id}`,
    {
      method: "DELETE",
    },
  );
}

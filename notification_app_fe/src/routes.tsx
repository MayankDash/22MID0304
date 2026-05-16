import { Routes, Route, Navigate } from "react-router-dom";
import NotificationsPage from "./pages/NotificationsPage";
import NotificationDetailPage from "./pages/NotificationDetailPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<NotificationsPage />} />
      <Route path="/notifications/:id" element={<NotificationDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

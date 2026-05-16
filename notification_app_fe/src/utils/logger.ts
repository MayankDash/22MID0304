const LOG_API_URL =
  import.meta.env.VITE_LOG_API_URL ||
  "http://4.224.186.213/evaluation-service/logs";

export async function Log(
  stack: "frontend" | "backend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  packageName: string,
  message: string,
) {
  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, package: packageName, message }),
    });
  } catch (err) {
    // ignore logging failures on client
  }
}

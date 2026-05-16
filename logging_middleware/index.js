const axios = require("axios");

const LOG_API_URL =
  process.env.LOG_API_URL || "http://4.224.186.213/evaluation-service/logs";

async function Log(stack, level, packageName, message) {
  const payload = { stack, level, package: packageName, message };
  try {
    if (process.env.DISABLE_REMOTE_LOG === "1") return;
    await axios.post(LOG_API_URL, payload, { timeout: 2000 });
  } catch (err) {
    // swallow errors from remote logging
  }
}

module.exports = { Log };

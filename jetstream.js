const WebSocket = require("ws");
const { shouldProcess } = require("./filters");
const { sendToWebhook } = require("./webhook");

const JETSTREAM_URL =
  "wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post";

function connect() {
  console.log("Connecting to Bluesky Jetstream...");

  const ws = new WebSocket(JETSTREAM_URL);

  ws.on("open", () => {
    console.log("Connected to Bluesky Jetstream");
  });

  ws.on("message", async (message) => {
    try {
      const event = JSON.parse(message);

      if (
        event.kind !== "commit" ||
        event.commit?.operation !== "create"
      ) {
        return;
      }

      const record = event.commit.record;

      if (!record?.text) {
        return;
      }

      if (!shouldProcess(record.text)) {
        return;
      }

      await sendToWebhook({
        username: event.did,
        text: record.text,
        url: `https://bsky.app/profile/${event.did}`,
        timestamp: record.createdAt || new Date().toISOString()
      });
    } catch (err) {
      console.error("Error processing event:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("Disconnected. Reconnecting in 5 seconds...");
    setTimeout(connect, 5000);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
  });
}

module.exports = {
  connect
};

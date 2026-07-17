const axios = require("axios");
const config = require("./config");

async function sendToWebhook(post) {
  if (!config.webhookUrl) {
    console.error("WEBHOOK_URL is not configured.");
    return;
  }

  try {
    await axios.post(config.webhookUrl, {
      platform: "Bluesky",
      username: post.username,
      post_text: post.text,
      post_url: post.url,
      timestamp: post.timestamp
    });

    console.log(`Sent post by @${post.username} to n8n.`);
  } catch (err) {
    console.error("Failed to send to n8n:", err.message);
  }
}

module.exports = {
  sendToWebhook
};

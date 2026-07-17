require("dotenv").config();

const http = require("http");
const axios = require("axios");

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok", service: "bluesky-listener" }));
  }

  if (req.method === "POST" && req.url === "/ingest") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");

        if (WEBHOOK_URL) {
          await axios.post(WEBHOOK_URL, payload);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end("Error");
      }
    });

    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const http = require("http");
const { connect } = require("./jetstream");
const config = require("./config");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "running",
        service: "bluesky-jetstream-listener"
      })
    );
    return;
  }

  if (req.url === "/health") {
    res.writeHead(200);
    res.end("OK");
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);

  // Start listening to Bluesky
  connect();
});

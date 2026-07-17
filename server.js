require('dotenv').config();

const http = require('http');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bluesky Jetstream Listener is running.");
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

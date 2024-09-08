const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("placeBid", ({ username, bid }) => {
    console.log(`New bid from ${username}: $${bid}`);
    
    // Broadcast the new bid to all connected clients, including the username
    io.emit("newBid", { username, bid });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Create a simple GET endpoint /api/hello
httpServer.on('request', (req, res) => {
  if (req.method === 'GET' && req.url === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello, World!' }));
  }
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

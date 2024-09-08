const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001"
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

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

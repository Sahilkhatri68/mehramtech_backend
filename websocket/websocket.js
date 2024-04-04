const socketIo = require("socket.io");

function initializeWebSocket(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle message from admin panel
    socket.on("admin_message", (data) => {
      console.log("Received message from admin:", data);
      // Broadcast message to shopkeeper panels
      socket.broadcast.emit("admin_message", data);
    });

    // Handle message from shopkeeper panel
    socket.on("shopkeeper_message", (data) => {
      console.log("Received message from shopkeeper:", data);
      // Broadcast message to admin panel
      socket.broadcast.emit("shopkeeper_message", data);
    });
    // Handle notification from shopkeeper
    socket.on("notification", (message) => {
      console.log("Received notification:", message);
      // Broadcast notification to admin panel
      socket.broadcast.emit("notification", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = initializeWebSocket;

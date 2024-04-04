const express = require("express");
const app = express();
const cors = require("cors");
const connectDb = require("./config/dbconn");
const http = require("http");
const socketIO = require("socket.io");
connectDb();
const PORT = 4000;
const server = http.createServer(app);
const io = socketIO(server);

// Initialize WebSocket
const initializeWebSocket = require("./websocket/websocket");
initializeWebSocket(io); // Pass io instead of server

// Add CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://www.motilearn.site",
      "https://mehramtech-adminpanel.vercel.app", // link of adminpanel
      "https://mehramtech-shopkeeperpanel.vercel.app", // link of shopkeeperpanel
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Motilearn_Services server is running properly....",
  });
});

// API routes
app.use("/api/adminsettings", require("./routes/adminsettings"));
app.use("/api/adminAuthentication", require("./routes/adminAuth"));
app.use("/api/shopkeepers", require("./routes/shopkeepers_api"));
app.use("/api/shopkeeperlogin", require("./routes/shopkeeper_login"));
app.use("/api/devicerequest", require("./routes/requestissueDevice"));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

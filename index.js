const express = require("express");
const app = express();
app.use(express.json());
const PORT = 4000;
const cors = require("cors");
const connectDb = require("./config/dbconn");
connectDb();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.motilearn.site",
  "https://mehramtech-adminpanel.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.json({
    message: "Motilearn_Services server is running properly....",
  });
});

// API TO ADD NEW PERSON
app.use("/api/shopkeepers", require("./routes/shopkeepers_api"));
app.use("/api/device", require("./routes/DeviceApi"));

app.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}`);
});

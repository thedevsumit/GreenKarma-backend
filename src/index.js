const express = require("express");
const connectDB = require("./lib/db");
const dotenv = require("dotenv");
const cors = require("cors");
const { authRoutes } = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const { itemRoutes } = require("./routes/item.routes");
const { transRoutes } = require("./routes/trans.routes");
const app = express();

app.use(cookieParser());
app.use(express.json());
dotenv.config();
              
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api", authRoutes);
app.use("/api", itemRoutes);
app.use("/api", transRoutes);

app.listen(8000, () => {
  console.log("App is listening on port number: ", 8000);

  connectDB();
});

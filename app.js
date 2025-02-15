require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const authRoutes = require("./api/routes/auth.router");
const collectionRoutes = require("./api/routes/collection.router");
const chatbotRouter = require("./api/routes/chatbot.router");
const resource = require("./api/routes/resource.router");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use("/images", express.static(path.join(__dirname, "images")));
console.log(path.join(__dirname, "images"));

// To protect from CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/resource", resource);

// setting mongoose connection and starting server
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MongoDB_URI)
  .then(() => {
    app.listen(process.env.APP_PORT || 3000, () => {
      console.log(
        "Server up and running on PORT:",
        process.env.APP_PORT || 3000
      );
    });
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
  });

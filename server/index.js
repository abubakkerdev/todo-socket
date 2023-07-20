const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const cors = require("cors");
const app = express();

mongoose
  .connect(
    "mongodb+srv://crud:KYXLrhFvEEPo02fc@cluster0.z0jh60i.mongodb.net/crud?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Db Connected");
  });

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", itemSchema);

const server = app.listen(8000, function () {
  console.log("port running");
});

// const io = socket(server);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket new client Connected");

  socket.emit("connected", "Socket.io  connnected from backend");

  socket.on("create", async (data) => {
    console.log("create Data", data);
    try {
      const newItem = new Item(data);
      await newItem.save();
      io.emit("created", newItem);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("read", async (data) => {
    try {
      const items = await Item.find();

      socket.emit("read", items);
    } catch (error) {
      console.log(error);
    }
  });
});

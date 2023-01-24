import { Server } from "socket.io";
import dbConnect from "../../lib/dbConnect";
import Message from "../../models/Message";
import User from "../../models/User";

const SocketHandler = async (req, res) => {
  await dbConnect();

  if (!res.socket?.server.io) {
    // Create a new socket server
    const io = new Server(res.socket?.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected: " + socket.id);
    });
  }
  res.end();
};

export default SocketHandler;

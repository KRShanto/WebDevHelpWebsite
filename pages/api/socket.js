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

      // ******** Set the user id and email ************ //
      socket.on("set-userId", async (userEmail) => {
        // Find the user in the database using the email
        const user = await User.findOne({
          email: userEmail,
        });

        // Save the user id and email to the socket session for this client
        socket.userId = user._id;
        socket.userEmail = userEmail;
      });

      // ******** Join/Change the room ************ //
      socket.on("join-room", (roomId) => {
        console.log("Joining room: " + roomId);

        // save the room id to the socket session for this client
        socket.roomId = roomId;
        socket.join(roomId);
      });

      // ******** Send a message ************ //
      socket.on("send-message", (message) => {
        console.log("Message: " + message);

        // Create a new Message
        const newMessage = new Message({
          roomId: socket.roomId,
          senderId: socket.userId,
          senderEmail: socket.userEmail,
          text: message,
        });

        // Save the Message to the database
        newMessage.save();

        // Send the message to the room
        socket.to(socket.roomId).emit("receive-message", newMessage);
        // Send the message to the sender
        socket.emit("receive-message", newMessage);
      });
    });
  }
  res.end();
};

export default SocketHandler;

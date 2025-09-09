const { Server } = require("socket.io");
const Message = require("./models/Message");

let io;

function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("joinGroup", ({ groupId, userId }) => {
      socket.join(groupId);
      console.log(`User ${userId} joined group ${groupId}`);
    });

    socket.on("sendMessage", async ({ groupId, userId, message, fileUrl }) => {
      try {
        const newMessage = await Message.create({
          group: groupId,
          sender: userId,
          content: message,
          file: fileUrl,
        });

        io.to(groupId).emit("receiveMessage", {
          _id: newMessage._id,
          group: groupId,
          sender: userId,
          content: message,
          file: fileUrl,
          createdAt: newMessage.createdAt,
        });
      } catch (error) {
        console.error("Send message error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
}

module.exports = { setupSocket };

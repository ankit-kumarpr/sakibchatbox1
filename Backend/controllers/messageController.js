const Message = require("../models/Message");

exports.getChatHistory = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const messages = await Message.find({ group: groupId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
};

exports.saveMessage = async (req, res) => {
  try {
    const { group, sender, content, file } = req.body;
    const message = new Message({ group, sender, content, file });
    await message.save();
    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message." });
  }
};
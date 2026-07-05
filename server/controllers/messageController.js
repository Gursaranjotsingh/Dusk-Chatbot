import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";

// @route   GET /api/messages/:id
// @desc    Get full conversation between logged-in user and :id
export const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const otherUser = await User.findById(id);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: id },
        { sender: id, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages sent to me as seen
    await Message.updateMany(
      { sender: id, receiver: req.user._id, seen: false },
      { seen: true, seenAt: new Date() }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/messages
// @desc    Send a message (also emitted via socket for real-time delivery)
export const sendMessage = async (req, res, next) => {
  try {
    const { receiver, text } = req.body;

    if (!receiver || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a receiver and message text",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver id",
      });
    }

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      text: text.trim(),
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

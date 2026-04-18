const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// 1. Send a Message
router.post("/send", protect, async (req, res) => {
    try {
        const { targetRole, content, receiverId } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const messageData = {
            senderId: req.user._id,
            content: content
        };

        if (targetRole) messageData.targetRole = targetRole;
        if (receiverId) messageData.receiverId = receiverId;

        const message = new Message(messageData);
        await message.save();

        res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get Messages (for Dashboard)
router.get("/", protect, async (req, res) => {
    try {
        // Find the demanding user's role
        const currentUser = await User.findById(req.user._id);

        if (!currentUser) return res.status(404).json({ message: "User not found" });

        if (currentUser.role === 'teacher') {
            // Teachers see messages addressed to 'teacher' or specifically to them
            // In a real app we'd filter by Teacher's assigned students, 
            // but for the demo we'll fetch all general student queries
            const messages = await Message.find({ targetRole: 'teacher' })
                .populate('senderId', 'name email role')
                .populate('receiverId', 'name email')
                .sort({ createdAt: -1 });
            return res.json(messages);
        } else {
            // Students see messages they sent, or replies sent back to them
            const messages = await Message.find({
                $or: [
                    { senderId: req.user._id },
                    { receiverId: req.user._id }
                ]
            })
            .populate('senderId', 'name email role')
            .populate('receiverId', 'name email role')
            .sort({ createdAt: -1 });

            return res.json(messages);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Mark message as read
router.put("/:id/read", protect, async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!message) return res.status(404).json({ message: "Message not found" });
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

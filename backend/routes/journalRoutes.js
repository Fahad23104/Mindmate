const { protect } = require("../middleware/authMiddleware");
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Journal = require("../models/Journal");

// Add new journal entry
router.post("/add", protect, async (req, res) => {
  const { title, content } = req.body;
  try {
    console.log("Received data:", req.body);  // Debug

    // Call AI API for sentiment analysis
    const aiResponse = await axios.post("https://mindmate-lhoj.onrender.com/analyze", {
      text: content,
    });

    // Save to MongoDB
    const newJournal = new Journal({
      title,
      content,
      sentiment: aiResponse.data.label,
      score: aiResponse.data.score,
      user: req.user._id  // associate with logged-in user
    });

    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (error) {
    console.error("Error saving journal:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all journal entries for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
     console.log("📥 Fetching journals for:", req.user._id);
    const journals = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log("✅ Journals returned:", journals.length);
    res.json(journals);
  } catch (error) {
    console.error("Error fetching journals:", error.message);
    res.status(500).json({ error: "Failed to fetch journal entries." });
  }
});

// Delete journal by ID
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ error: "Journal not found" });
    res.json({ message: "Journal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update journal (and re-analyze sentiment)
router.put("/:id", protect, async (req, res) => {
  const { title, content } = req.body;
  try {
    // Re-analyze sentiment
    const aiResponse = await axios.post("https://mindmate-lhoj.onrender.com/analyze", {
      text: content,
    });

    const updated = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title,
        content,
        sentiment: aiResponse.data.label,
        score: aiResponse.data.score,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Journal not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/sentiments', protect, async (req, res) => {
  try {
    const data = await Journal.find({ user: req.user.id }).sort({ createdAt: 1 });
    const chartData = data.map(entry => ({
      date: entry.createdAt,
      sentiment: entry.sentiment
    }));
    console.log("📊 Sentiment data for chart:", chartData);
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching sentiment data' });
  }
});

module.exports = router;

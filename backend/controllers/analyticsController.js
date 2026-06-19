const mongoose = require("mongoose");
const History = require("../models/History");

const DATE_FORMATS = {
  daily: "%Y-%m-%d",
  weekly: "%Y-%U",
  monthly: "%Y-%m",
};

// GET /analytics/summary
const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const counts = await History.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$prediction", count: { $sum: 1 } } },
    ]);

    const byLabel = counts.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    const spamCount = byLabel.spam || 0;
    const hamCount = byLabel.ham || 0;
    const offensiveCount = byLabel.offensive || 0;
    const totalScanned = counts.reduce((sum, { count }) => sum + count, 0);

    res.json({
      totalScanned,
      spamCount,
      hamCount,
      offensiveCount,
      spamPercentage: totalScanned ? Number(((spamCount / totalScanned) * 100).toFixed(2)) : 0,
      hamPercentage: totalScanned ? Number(((hamCount / totalScanned) * 100).toFixed(2)) : 0,
      offensivePercentage: totalScanned ? Number(((offensiveCount / totalScanned) * 100).toFixed(2)) : 0,
    });
  } catch (err) {
    console.error("Analytics summary error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /analytics/trends?range=daily|weekly|monthly
const getTrends = async (req, res) => {
  try {
    const range = ["daily", "weekly", "monthly"].includes(req.query.range)
      ? req.query.range
      : "daily";

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const trends = await History.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: DATE_FORMATS[range], date: "$createdAt" } },
            label: "$prediction",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    res.json(
      trends.map(({ _id, count }) => ({
        date: _id.date,
        label: _id.label,
        count,
      })),
    );
  } catch (err) {
    console.error("Analytics trends error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /analytics/breakdown
const getBreakdown = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const breakdown = await History.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { type: "$type", label: "$prediction" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(
      breakdown.map(({ _id, count }) => ({
        type: _id.type,
        label: _id.label,
        count,
      })),
    );
  } catch (err) {
    console.error("Analytics breakdown error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getSummary,
  getTrends,
  getBreakdown,
};

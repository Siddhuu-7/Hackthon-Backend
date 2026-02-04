const express = require("express");
const RegModel = require("../models/reg.model");
const sendMail = require("../utils/mailsender");

const Router = express.Router();

function buildSampleData(team) {
  return {
    teamName: team.teamName,
    teamLeadName: team.teamLead.name,
    teamMembers: team.teamMembers.map(m => m.name),
    registrationFee: team.teamLead.price,
    eventName: "Udbhav-2k26",
    eventDate: "March 05, 2026",
    eventTime: "8:00 AM - 8:00 PM",
    eventVenue: "IT, SRKR, Bhimavaram",
  };
}

Router.post("/verify", async (req, res) => {
  try {
    const { teamcode, transactionId } = req.body;

    if (!teamcode || !transactionId) {
      return res.status(400).json({ error: "Missing data" });
    }

    // ✅ fetch team from DB
    const team = await RegModel.findOne({ teamcode });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // ✅ update payment details
    team.transactionId = transactionId;
    team.paymentStatus = "DONE";
    await team.save();

    // ✅ send email
    const emailData = buildSampleData(team);
    await sendMail(team.teamLead.email, emailData);

    res.json({ success: true });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = Router;

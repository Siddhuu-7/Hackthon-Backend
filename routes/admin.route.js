const express = require("express");
const RegModel = require("../models/reg.model");
const sendMail = require("../utils/mailsender");
const singleregModel = require("../models/singlereg.model");

const Router = express.Router();

function buildSampleData(team) {
  return {
    teamName: team.teamName,
    teamLeadName: team.teamLead.name,
    teamcode:team.teamcode,
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

    if (!teamcode ) {
      return res.status(400).json({ error: "Missing data" });
    }

    
    const team = await RegModel.findOne({ teamcode });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    
    // team.transactionId = transactionId;
    team.paymentStatus = "DONE";
    await team.save();

    
    const emailData = buildSampleData(team);
    await sendMail(team.teamLead.email, emailData);

    res.json({ success: true });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
Router.get("/admin/singels",async(req,res)=>{
  try {
    const {adminCode}=req.query
    if (adminCode!==process.env.ADMIN_CODE) {
      return res.status(403).json({ msg: "Invalid or missing admin code" });
    }
    const data=await singleregModel.find({},{
      _id:1,
      name:1,
      mobile:1,
      price:1,
      transactionId:1,
      paymentStatus:1,
      updatedAt:1
    });
    if(!data){
      return res.status(404).json({msg:"No New Regestrations"})
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(504).json({msg:error})
  }
})

Router.post("/admin/payment/paid",async(req,res)=>{
  try {
    const{name,_id}=req.body;
    const {adminCode}=req.query
    if (adminCode!==process.env.ADMIN_CODE) {
      return res.status(403).json({ msg: "Invalid or missing admin code" });
    }
    const regData = await singleregModel.findByIdAndUpdate(
       _id, 
      {
        $set: {
          
          paymentStatus: "PAID"
        }
      },
      { new: true }
    );
    return res.status(200).json({msg:"done"})
  } catch (error) {
        res.status(500).send("Server error");
        console.log(error)
  }
})
Router.post("/admin/payment/failed",async(req,res)=>{
  try {
    const {adminCode}=req.query
    if (adminCode!==process.env.ADMIN_CODE) {
      return res.status(403).json({ msg: "Invalid or missing admin code" });
    }
 const{name,_id}=req.body;
     const regData = await singleregModel.findByIdAndUpdate(
      _id, 
      {
        $set: {
          
          paymentStatus: "FAILED"
        }
      },
      { new: true }
    );
    return res.status(200).json({msg:"done"})
  } catch (error) {
        res.status(500).send("Server error");
  }
})


module.exports = Router;

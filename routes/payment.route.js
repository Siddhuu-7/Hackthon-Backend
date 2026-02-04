const express = require("express");
const Router = express.Router();
const sheetsUtil=require("../utils/googlesheets")
const RegModel=require("../models/reg.model")
const {calculateTotalAmount}=require("../utils/totalamount")
Router.get("/payment", async(req, res) => {

const {teamName}=req.query

const teamdata=await RegModel.findOne({teamName:teamName})
const totalamount=calculateTotalAmount(teamdata)
  res.render("payment", {
    teamName: `${teamdata.teamName}`,
    teamcode: `${teamdata.teamcode}`,
    leadName: `${teamdata.teamLead.name}`,
    amount: totalamount
  });
});
Router.post("/payment/submit", async (req, res) => {
  try {
    
    const { teamName, teamcode, transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).send("Transaction ID required");
    }

    const regData = await RegModel.findOneAndUpdate(
      { teamName }, 
      {
        $set: {
          transactionId,
          paymentStatus: "DONE"
        }
      },
      { new: true }
    );
    const totalamount=calculateTotalAmount(regData)
sheetsUtil.saveToGoogleSheet(regData.toObject()).catch(err =>
  console.error("Sheet backup failed:", err)
);
    if (!regData) {
      return res.status(404).send("Team not found");
    }

    res.render("thanks", {
    teamName: `${regData.teamName}`,
    teamcode: `${regData.teamcode}`,
    transactionId: `${regData.transactionId}`,
    amount: totalamount,
    coordinatorName1 :"Vijay",
    coordinatorPhone1:"92877890",
    coordinatorName2 :"vijay2",
    coordinatorPhone2:"43678748"
  });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports=Router
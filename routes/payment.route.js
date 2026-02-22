const express = require("express");
const Router = express.Router();
const sheetsUtil=require("../utils/googlesheets")
const sheetsUtilSingle=require("../utils/single.sheets")
const RegModel=require("../models/reg.model")
const {calculateTotalAmount}=require("../utils/totalamount")
const singleregModel = require("../models/singlereg.model");
require("dotenv").config()
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
    coordinatorName1 :"Shaik Mahammad Rafi",
    coordinatorPhone1:"+91 6281552485",
    coordinatorName2 :"Kambala Charan Teja ",
    coordinatorPhone2:"+91 8465833353"
  });
  } catch (error) {
    // console.error(error);
    res.status(500).send("Server error");
  }
});

Router.post("/payment/paid",async(req,res)=>{
  try {
    const{teamName}=req.body;
    const {adminCode}=req.query
    if (adminCode!==process.env.ADMIN_CODE) {
      return res.status(403).json({ msg: "Invalid or missing admin code" });
    }
    const regData = await RegModel.findOneAndUpdate(
      { teamName }, 
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
Router.post("/payment/failed",async(req,res)=>{
  try {
    const {adminCode}=req.query
    if (adminCode!==process.env.ADMIN_CODE) {
      return res.status(403).json({ msg: "Invalid or missing admin code" });
    }
    const{teamName}=req.body;
    const regData = await RegModel.findOneAndUpdate(
      { teamName }, 
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






Router.get("/singel/payment", async(req, res) => {

const {name}=req.query

const member=await singleregModel.findOne({name:name})
try {
   res.render("singelpayment", {
    name: `${member.name}`,
    amount: `${member.price}`
  });
} catch (error) {
  console.log(error)
}
 
});
Router.post("/singel/payment/submit", async (req, res) => {
  try {
    
    const { name, transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).send("Transaction ID required");
    }

    const regData = await singleregModel.findOneAndUpdate(
      { name }, 
      {
        $set: {
          transactionId,
          paymentStatus: "DONE"
        }
      },
      { new: true }
    );
   
sheetsUtilSingle.saveToGoogleSheetSingle(regData.toObject()).catch(err =>
  console.error("Sheet backup failed:", err)
);
    if (!regData) {
      return res.status(404).send("name not found");
    }

    res.render("singelthanks", {
    name: `${regData.name}`,
    transactionId: `${regData.transactionId}`,
    amount: regData.price,
    coordinatorName1 :"Shaik Mahammad Rafi",
    coordinatorPhone1:"+91 6281552485",
    coordinatorName2 :"Kambala Charan Teja ",
    coordinatorPhone2:"+91 8465833353"
  });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
module.exports=Router
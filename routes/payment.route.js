const express = require("express");
const Router = express.Router();
const sheetsUtil=require("../utils/googlesheets")
const RegModel=require("../models/reg.model")
const generatePaymentPDF = require("../utils/generatePdf"); // NEW
const {calculateTotalAmount}=require("../utils/totalamount")
const axios=require("axios")
const {StandardCheckoutClient,Env,StandardCheckoutPayRequest}=require("pg-sdk-node")
const {randomUUId}=require("crypto");
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
Router.get("/payment/pdf/:teamcode", async (req, res) => {
  const regData = await RegModel.findOne({
    teamcode: req.params.teamcode,
  });

  const totalamount = calculateTotalAmount(regData);

  const pdfData = {
    teamName: regData.teamName,
    teamcode: regData.teamcode,
    transactionId: regData.transactionId,
    amount: totalamount,
    coordinatorName1: "Shaik Mahammad Rafi",
    coordinatorPhone1: "+91 6281552485",
    coordinatorName2: "Kambala Charan Teja",
    coordinatorPhone2: "+91 8465833353",
  };

  const pdfBuffer = await generatePaymentPDF(pdfData);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=receipt-${regData.teamcode}.pdf`,
  });

  res.send(pdfBuffer);
});
Router.post("/payment/paid",async(req,res)=>{
  try {
    const{teamName}=req.body;
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



// const clientId=process.env.CLIENT_ID
// const clientSecret=process.env.CLIENT_SECRECT
// const clientVersion=1
// const env=Env.SANDBOX
// const client=StandardCheckoutClient.getInstance(clientId,clientSecret,clientVersion,env)

// Router.post("/phonepe",async(req,res)=>{
// try {
//   const {amount}=req.body
//   if(!amount){
//     return res.status(400).send("amount is required")
//   }
//   const merchantorderId=randomUUId()
//   const redirectUrl=`http://localhost:6961/check-status?merchantorderId=${merchantorderId}`
//   const request=StandardCheckoutPayRequest.builder().merchantOrderId(merchantorderId).amount(amount)
//   .redirectUrl(redirectUrl).build()
//   const response=await client.pay(request)
//   return res.json({
//     checkoutPageUrl:response.redirectUrl
//   })
// } catch (error) {
//   console.log(error)
// }
// })
// Router.get("check-status",async(req,res)=>{
//   const {merchantorderId}=req.query
//   res.send("check "+merchantorderId)
// })
module.exports=Router
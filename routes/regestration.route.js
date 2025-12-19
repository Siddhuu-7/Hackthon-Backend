const express = require("express");
const checkDuplicates = require("../middelware/TeamVerfication.middelware");
const RegModel = require("../models/reg.model");
const requiredfields=require("../middelware/requiredFields.middelware")
const Router = express.Router();
const saveToGoogleSheet=require("../utils/googlesheets")
Router.post(
  "/reg",
  requiredfields,
  checkDuplicates,
  async (req, res) => {
    try {
      const data = req.body;

      
      if (!data.teamName || !data.teamName.trim()) {
        return res.status(400).json({
          success: false,
          msg: "Team name is required",
        });
      }

      if (!Array.isArray(data.teamMembers)) {
        data.teamMembers = [];
      }

      
      if (!data.teamLead) {
        return res.status(400).json({
          success: false,
          msg: "Team lead details are required",
        });
      }

      
      data.teamLead.isCsi = Boolean(data.teamLead.isCsi);
      data.teamLead.price = data.teamLead.isCsi ? 750 : 850;

      data.teamMembers = data.teamMembers.map(m => ({
        ...m,
        isCsi: Boolean(m.isCsi),
        price: m.isCsi ? 750 : 850,
      }));

      
      if (!data.teamcode) {
        data.teamcode = `TEAM-${Date.now()}`;
      }

      const registration = await RegModel.create(data);

      return res.status(201).json({
        success: true,
        msg: "Team registered successfully",
        data: {
          id: registration._id,
          teamcode: registration.teamcode,
        },
      });

    } catch (error) {
      // console.error("Registration error:", error);

      
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          msg: "Team name already exists So Change Your Team Name and Submit",
        });
      }

      return res.status(500).json({
        success: false,
        msg: "Internal server error",
      });
    }
  }
);

Router.get("/check-team-name", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ available: false });
  }

 const exists = await RegModel.findOne({
  teamName: { $regex: `^${name}$`, $options: "i" },
 
});


  res.json({
    available: !exists
  });
});
Router.post("/payment-verfiaction",async(req,res)=>{
  try {
    
  } catch (error) {
    res.status(504).json({msg:error})
  }
})
Router.get("/admin/teams",async(req,res)=>{
  try {
    const teams=await RegModel.find();
    if(!teams){
      return res.status(404).json({msg:"No New Regestrations"})
    }
    res.status(200).json(teams)
  } catch (error) {
    res.status(504).json({msg:error})
  }
})
module.exports = Router;

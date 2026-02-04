const express = require("express");
const checkDuplicates = require("../middelware/TeamVerfication.middelware");
const RegModel = require("../models/reg.model");
const requiredfields=require("../middelware/requiredFields.middelware");
const { getMembers } = require("../utils/googlesheets");
const Router = express.Router();
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
      data.teamLead.price = data.teamLead.isCsi ? 600 : 600;

      data.teamMembers = data.teamMembers.map(m => ({
        ...m,
        isCsi: Boolean(m.isCsi),
        price: m.isCsi ? 600 : 600,
      }));

      console.log(data)
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
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          msg: "Team name already exists So Change Your Team Name and Submit",
        });
      }
      
      return res.status(500).json({
        success: false,
        msg: error,
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

Router.get("/verify", async (req, res) => {
  const { mobileNumber, email } = req.query;

  try {
    if (!mobileNumber && !email) {
      return res.status(400).json({
        found: false,
        message: "mobileNumber or email is required",
      });
    }

    const members = getMembers();

    const member = members.find(m => {
  const emailMatch =
    email && m.email.toLowerCase() === email.toLowerCase();

  const mobileMatch =
    mobileNumber && m.mobile === mobileNumber;

  return emailMatch || mobileMatch;
});

    if (!member) {
      return res.status(200).json({
        found: false,
      });
    }

    return res.status(200).json({
      found: true,
      member: {
        name: member.name,
        email: member.email,
        mobile: member.mobile,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      found: false,
      error: "Internal server error",
    });
  }
});

module.exports = Router;

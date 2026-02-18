const express = require("express");
const checkDuplicates = require("../middelware/TeamVerfication.middelware");
const RegModel = require("../models/reg.model");
const requiredfields=require("../middelware/requiredFields.middelware");
const { getMembers } = require("../utils/googlesheets");
const Router = express.Router();
const fileController=require("../middelware/fileController")
const {generateCode} =require("../utils/teamcodeGenarator")
const singleregModel = require("../models/singlereg.model");
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
      data.teamLead.price = data.teamLead.isCsi ? 800 : 800;

      data.teamMembers = data.teamMembers.map(m => ({
        ...m,
        isCsi: Boolean(m.isCsi),
        price: m.isCsi ? 800 : 800,
      }));

      // console.log(data)
      if (!data.teamcode) {
        data.teamcode = `TEAM-${Date.now()}`;
      }
      let existname = await RegModel.findOne({ teamName: data.teamName });
if (existname) {
  const randomNum = Math.floor(100 + Math.random() * 900);
  data.teamName = `${data.teamName}${randomNum}`;
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
  paymentStatus: { $in: ["PENDING", "FAILED"] }
});

  res.json({
    available: !exists
  });
});


Router.get("/admin/teams",async(req,res)=>{
  try {
    const {adminCode}=req.query
    if (adminCode!==process.env.ADMIN_CODE) {
      return res.status(403).json({ msg: "Invalid or missing admin code" });
    }
    const teams=await RegModel.find({},{
      _id:0,
      teamName:1,
      "teamLead.name":1,
      "teamLead.mobile":1,
      "teamLead.price":1,
      "teamMembers":1,
      "transactionId":1,
      paymentStatus:1
    });
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
Router.get("/get-team-details/:teamcode",async(req,res)=>{
  try {
    const {teamcode}=req.params
    const data=await RegModel.findOne({teamcode,
      paymentStatus:"PAID"
    },
      
  {
    teamName: 1,
    teamcode: 1,
    "teamLead.name": 1,
    "teamLead.price":1,
    "teamMembers.name": 1,
    problemstatment:1,
    _id: 0
  }
    )
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})
Router.post("/ideasubmission", async (req, res) => {
  try {
    const { teamcode, statement } = req.body;

    const updatedData = await RegModel.findOneAndUpdate(
      { teamcode },
      { $push: { problemstatment: statement } },
      { new: true } 
    );

    res.status(200).json({
      msg: updatedData.problemstatment
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
Router.get("/download-ppt",fileController)
Router.post("/single/reg",async(req,res)=>{
      try {
      const data = req.body;

const registration = await singleregModel.create(data);
      return res.status(201).json({
        success: true,
        msg: " registered successfully",
        data: {
          id: registration._id,
          teamcode: registration.teamcode,
        },
      });
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        msg: error,
      });
    }
  
  })

module.exports = Router;

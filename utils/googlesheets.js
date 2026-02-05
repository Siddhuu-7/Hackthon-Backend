const { google } = require("googleapis");
const path = require("path");
require("dotenv").config()
const fs=require("fs")
const {calculateTotalAmount}=require("../utils/totalamount")
const auth = new google.auth.GoogleAuth({
  keyFile: 
  process.env.NODE_ENV === "production"
      ? "/etc/secrets/credentials.json"        
      : path.join(__dirname, "../credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Sheet1"; 

async function saveToGoogleSheet(reg) {
  const rows = [];
  const totalamount=calculateTotalAmount(reg)
  rows.push([
    reg.teamName,                 // A Team Name
    reg.collegeType,              // B College Type
    reg.teamLead.name,            // C Name
    reg.teamLead.mobile,          // D Mobile
    reg.teamLead.email,           // E Email
    reg.teamLead.name    ,        // F TL Name
    reg.teamLead.mobile,          // F TL Mobile
    reg.teamLead.email,           // G TL Email
    reg.teamLead.tshirtSize,      // H T Size
    reg.teamLead.year,            // I Year
    reg.teamLead.location,        // J Location
    reg.teamLead.gender || "",    // K Gender
    reg.teamLead.isCsi ? "YES" : "NO", // L iscsi
    reg.teamLead.price,          //  Amount
    totalamount,
    reg.transactionId,          //trasaction
    reg.teamcode,
    reg.teamLead.regnum
  ]);

  
  for (const member of reg.teamMembers) {
    rows.push([
      reg.teamName,               // A Team Name
      reg.collegeType,            // B College Type
      member.name,                // C Name
      member.mobile,              // D Mobile
      member.email,               // E Email
      reg.teamLead.name    ,      // F TL Name
      reg.teamLead.mobile,        // G TL Mobile
      reg.teamLead.email,         // H TL Email
      member.tshirtSize,          // I T Size
      member.year,                // J Year
      member.location,            // K Location
      member.gender || "",        // L Gender
      member.isCsi ? "YES" : "NO", // M iscsi
      member.price          ,        //Amount
      totalamount,              // totalAmount
    reg.transactionId,          //transactionId
    reg.teamcode             , //Team code
      member.regnum
    ]);
  }
// const meta = await sheets.spreadsheets.get({
//   spreadsheetId: ,
// });

// console.log(
//   "SHEET TABS:",
//   meta.data.sheets.map(s => s.properties.title)
// );

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: rows,
    },
  });
}




// async function loadSheet() {
//   const meta = await sheets.spreadsheets.get({
//     spreadsheetId:process.env.SPREADSHEET_ID_CSI_REGESTER,
//   });

//   const sheetNames = meta.data.sheets.map(
//     s => s.properties.title
//   );

//   let all = [];

//   for (const sheetName of sheetNames) {
//     const res = await sheets.spreadsheets.values.get({
//       spreadsheetId:process.env.SPREADSHEET_ID_CSI_REGESTER,
//       range: `'${sheetName}'!A2:Z`, 
//     });

//     const rows = res.data.values || [];

//     rows.forEach(row => {
//       if (row[3] && row[4] && row[5]) {
//         all.push({
//           name: row[3].trim(),
//           mobile: row[4].trim(),
//           email: row[5].trim(),
//         });
//       }
//     });
//   }

//   MEMBERS = all;s
//   // console.table(MEMBERS)

// }
function findByEmail(email, members) {
  return members.find(
    m => m.email === email.toLowerCase()
  );
}


let MEMBERS = [];

function loadMembers() {
  const FILE_PATH =
    process.env.NODE_ENV === "production"
      ? "/etc/secrets/members.json"        
      : path.join(__dirname, "../members.json"); 

  const raw = fs.readFileSync(FILE_PATH, "utf8");
  MEMBERS = JSON.parse(raw);

  console.log("Members loaded:", MEMBERS.length);
}

function getMembers() {
  return MEMBERS;
}



module.exports = {saveToGoogleSheet ,findByEmail,loadMembers,getMembers};

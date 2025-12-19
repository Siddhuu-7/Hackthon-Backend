const { google } = require("googleapis");
const path = require("path");
require("dotenv").config()
const {calculateTotalAmount}=require("../utils/totalamount")
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, GOOGLE_APPLICATION_CREDENTIALS),
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
    reg.teamcode
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
    reg.teamcode              //Team code
    ]);
  }
// const meta = await sheets.spreadsheets.get({
//   spreadsheetId: SPREADSHEET_ID,
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

module.exports = saveToGoogleSheet;

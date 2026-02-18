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

const SPREADSHEET_ID = process.env.SPREADSHEET_SINGEL;
const SHEET_NAME = "Sheet1"; 

async function saveToGoogleSheetSingle(member) {
  const rows = [];
  const totalamount=member.price
  rows.push([
    member.name,                 // A Team Name
    member.collegeType,              // B College Type
    member.mobile,          // D Mobile
    member.email,           // E Email
    member.tshirtSize,      // H T Size
    member.year,            // I Year
    member.location,        // J Location
    member.gender || "",    // K Gender
    member.price,          //  Amount
    totalamount,
    member.transactionId,          //trasaction
    member.regnum
  ]);

  

// const meta = await sheets.spreadsheets.get({
//   spreadsheetId: SPREADSHEET_ID,
// });
// console.log(meta.data.properties.title);


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



module.exports = {saveToGoogleSheetSingle};

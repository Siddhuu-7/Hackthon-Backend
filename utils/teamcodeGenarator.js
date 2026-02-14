const crypto = require("crypto");

function generateCode(length=16) {
    return  crypto.randomBytes(length / 2).toString("hex");
}
module.exports={generateCode}
const fs=require("fs")
const path=require("path")
async function fileController(req, res, next) {
    try {
        const { teamName } = req.query; 

        const fileDoc =  fs.readFileSync(path.join(__dirname,"../public/Udbhav2k26.pptx"));

        if (!fileDoc) {
            return res.status(404).json({ msg: "File not found" });
        }

       
        const filename = teamName?`${teamName}Udbhav2k26.pptx` : "Udbhav2k26.pptx";
        const mimetype = "application/octet-stream";

        res.set({
            "Content-Type": mimetype,
            "Content-Disposition": `attachment; filename="${filename}"`,
        });

        res.send(fileDoc); 
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
module.exports=fileController
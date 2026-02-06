const express=require("express")
const app=express()
const cors=require("cors")
require("dotenv").config()
const RegRouter=require("./routes/regestration.route")
const PORT=process.env.PORT
const mongoose=require("mongoose")
const paymentrouter=require("./routes/payment.route")
const sheetsUtil = require("./utils/googlesheets");
const adminroute=require("./routes/admin.route")
app.use(cors({
  origin: "*"
}));
app.use(express.json())
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use("",paymentrouter)

app.use("",RegRouter)
app.use("/admin",adminroute)
mongoose.connect(process.env.MONGODB).then(()=>{
    console.log("Data Base Connected")
}).catch(err=>{
    console.log(err)
})
sheetsUtil.loadMembers()

app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
   
})

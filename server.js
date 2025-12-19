const express=require("express")
const app=express()
const cors=require("cors")
require("dotenv").config()
const RegRouter=require("./routes/regestration.route")
const PORT=process.env.PORT
const mongoose=require("mongoose")
const paymentrouter=require("./routes/payment.route")
app.use(express.json())
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use("",paymentrouter)
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use("",RegRouter)
mongoose.connect(process.env.MONGODB).then(()=>{
    console.log("Data Base Connected")
}).catch(err=>{
    console.log(err)
})
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})

const express = require("express");
const app= express();
const cors = require('cors');
require("dotenv").config();
const sequelize = require("./app/config/db");
PORT= process.env.PORT || 5000
const userRoutes = require("./app/routes/userRoutes");
const authRoutes = require("./app/routes/authRoutes");


const corsOptions = {
  origin: 'http://localhost:3000', // frontend origin
  credentials: true,              // allow cookies (if needed)
};



// middlerware 
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/user",userRoutes)


// test route
app.get("/",(req,res)=>{
    return res.status(200).json({message:"Welcome to authentication system."})
})


sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.error("Database connection error:", error));


sequelize.sync({force: false}).then(()=>{
    app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
})

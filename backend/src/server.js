import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import startROICron from "./cron/roi.cron.js";

const PORT = process.env.PORT || 5000;

await connectDB();

// Start ROI Cron
startROICron();

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
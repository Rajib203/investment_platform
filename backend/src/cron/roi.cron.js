import cron from "node-cron";
import { processDailyROI } from "../services/roi.service.js";

const startROICron = () => {
  // Every day at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    console.log("==================================");
    console.log("Running Daily ROI Distribution...");
    console.log("Time:", new Date());

    try {
      const result = await processDailyROI();

      console.log(result.message);
    } catch (error) {
      console.error("ROI Cron Error:", error.message);
    }

    console.log("==================================");
  });

  console.log("✅ ROI Cron Started");
};

export default startROICron;
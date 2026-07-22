import mongoose from "mongoose";
import dotenv from "dotenv";

import Plan from "./src/models/plan.model.js";

dotenv.config();

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    await Plan.deleteMany();

    await Plan.insertMany([
      {
        planName: "Starter Plan",
        amount: 5000,
        dailyROIPercentage: 1,
        duration: 30,
      },
      {
        planName: "Silver Plan",
        amount: 10000,
        dailyROIPercentage: 1.5,
        duration: 60,
      },
      {
        planName: "Gold Plan",
        amount: 25000,
        dailyROIPercentage: 2,
        duration: 90,
      },
      {
        planName: "Platinum Plan",
        amount: 50000,
        dailyROIPercentage: 2.5,
        duration: 180,
      },
    ]);

    console.log("✅ Investment Plans Seeded Successfully");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedPlans();
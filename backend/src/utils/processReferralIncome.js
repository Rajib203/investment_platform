import User from "../models/user.model.js";
import ReferralIncome from "../models/referralIncome.model.js";
import Transaction from "../models/transaction.model.js";
import referralLevels from "../config/referralLevels.js";

export const processReferralIncome = async (
  userId,
  investmentAmount
) => {
  let currentUser = await User.findById(userId);

  for (const levelInfo of referralLevels) {
    if (!currentUser?.referredBy) break;

    const sponsor = await User.findById(currentUser.referredBy);

    if (!sponsor) break;

    const commission =
      (investmentAmount * levelInfo.percentage) / 100;

    sponsor.walletBalance += commission;
    sponsor.totalLevelIncomeEarned += commission;

    await sponsor.save();

    await ReferralIncome.create({
      receiver: sponsor._id,
      generatedBy: currentUser._id,
      level: levelInfo.level,
      amount: commission,
    });

    await Transaction.create({
      user: sponsor._id,
      type: "REFERRAL_INCOME",
      amount: commission,
      description: `Level ${levelInfo.level} Referral Income`,
    });

    currentUser = sponsor;
  }
};
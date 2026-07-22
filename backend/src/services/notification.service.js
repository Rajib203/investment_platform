import { sendEmail } from "../utils/email.js";

/*
|--------------------------------------------------------------------------
| Welcome Email
|--------------------------------------------------------------------------
*/

export const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: "Welcome to Investment Platform",
    html: `
        <h2>Welcome ${user.fullName}</h2>

        <p>Your account has been created successfully.</p>

        <p><b>Referral Code:</b> ${user.referralCode}</p>

        <p>Thank you for joining us.</p>
    `,
  });
};
/* ==========================================
   Deposit Request Email
========================================== */

export const sendDepositRequestEmail = async (
  user,
  deposit
) => {
  try {
    await sendEmail({
      to: user.email,
      subject: "Deposit Request Submitted",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>Hello ${user.fullName},</h2>

          <p>
            Your deposit request has been received successfully.
          </p>

          <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;">
            <tr>
              <td><strong>Amount</strong></td>
              <td>₹${deposit.amount}</td>
            </tr>

            <tr>
              <td><strong>Payment Method</strong></td>
              <td>${deposit.paymentMethod}</td>
            </tr>

            <tr>
              <td><strong>Status</strong></td>
              <td>${deposit.status}</td>
            </tr>

            <tr>
              <td><strong>Date</strong></td>
              <td>${new Date(deposit.createdAt).toLocaleString()}</td>
            </tr>
          </table>

          <br>

          <p>
            Your payment will be verified by our admin team.
          </p>

          <p>
            You will receive another email once it has been approved or rejected.
          </p>

          <br>

          <p>
            Thanks,<br/>
            Investment Platform Team
          </p>
        </div>
      `,
    });

    console.log("Deposit request email sent.");
  } catch (error) {
    console.error(
      "Deposit Request Email Error:",
      error.message
    );
  }
};

/*
|--------------------------------------------------------------------------
| Investment Created
|--------------------------------------------------------------------------
*/

export const sendInvestmentEmail = async (
  user,
  investment
) => {
  await sendEmail({
    to: user.email,
    subject: "Investment Successful",
    html: `
        <h2>Hello ${user.fullName}</h2>

        <p>Your investment has been created successfully.</p>

        <table border="1" cellpadding="8">
            <tr>
                <td>Plan</td>
                <td>${investment.planName}</td>
            </tr>

            <tr>
                <td>Amount</td>
                <td>₹${investment.amount}</td>
            </tr>

            <tr>
                <td>ROI</td>
                <td>${investment.dailyROIPercentage}% Daily</td>
            </tr>

            <tr>
                <td>Start Date</td>
                <td>${investment.startDate}</td>
            </tr>
        </table>
    `,
  });
};

/*
|--------------------------------------------------------------------------
| ROI Credited
|--------------------------------------------------------------------------
*/

export const sendROIEmail = async (
  user,
  amount
) => {
  await sendEmail({
    to: user.email,
    subject: "Daily ROI Credited",
    html: `
        <h2>Hello ${user.fullName}</h2>

        <p>Your daily ROI has been credited.</p>

        <h3>₹${amount}</h3>

        <p>Please login to your dashboard.</p>
    `,
  });
};

/*
|--------------------------------------------------------------------------
| Withdrawal Requested
|--------------------------------------------------------------------------
*/

export const sendWithdrawalRequestEmail = async (
  user,
  withdrawal
) => {
  await sendEmail({
    to: user.email,
    subject: "Withdrawal Request Received",
    html: `
        <h2>Hello ${user.fullName}</h2>

        <p>Your withdrawal request has been received.</p>

        <p><b>Amount:</b> ₹${withdrawal.amount}</p>

        <p>Status: Pending</p>
    `,
  });
};

/*
|--------------------------------------------------------------------------
| Withdrawal Approved
|--------------------------------------------------------------------------
*/

export const sendWithdrawalApprovedEmail = async (
  user,
  withdrawal
) => {
  await sendEmail({
    to: user.email,
    subject: "Withdrawal Approved",
    html: `
        <h2>Hello ${user.fullName}</h2>

        <p>Your withdrawal request has been approved.</p>

        <p><b>Amount:</b> ₹${withdrawal.amount}</p>

        <p>Status: Approved</p>
    `,
  });
};

/*
|--------------------------------------------------------------------------
| Withdrawal Rejected
|--------------------------------------------------------------------------
*/

export const sendWithdrawalRejectedEmail = async (
  user,
  withdrawal
) => {
  await sendEmail({
    to: user.email,
    subject: "Withdrawal Rejected",
    html: `
        <h2>Hello ${user.fullName}</h2>

        <p>Your withdrawal request has been rejected.</p>

        <p><b>Amount:</b> ₹${withdrawal.amount}</p>

        <p>Status: Rejected</p>
    `,
  });
};

/*
|--------------------------------------------------------------------------
| KYC Approved
|--------------------------------------------------------------------------
*/

export const sendKYCApprovedEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: "KYC Approved",
    html: `
      <h2>Hello ${user.fullName}</h2>

      <p>Your KYC has been verified successfully.</p>

      <p>You can now enjoy all platform features.</p>

      <p>Thank you.</p>
    `,
  });
};

/*
|--------------------------------------------------------------------------
| KYC Rejected
|--------------------------------------------------------------------------
*/

export const sendKYCRejectedEmail = async (
  user,
  remark
) => {
  await sendEmail({
    to: user.email,
    subject: "KYC Rejected",
    html: `
      <h2>Hello ${user.fullName}</h2>

      <p>Your KYC verification was rejected.</p>

      <p><b>Reason:</b> ${remark || "Please upload valid documents."}</p>

      <p>Please login and resubmit your KYC.</p>
    `,
  });
};
export const sendDepositApprovedEmail = async (user, deposit) => {
  try {
    await sendEmail({
      to: user.email,
      subject: "Deposit Approved",
      html: `
        <h2>Hello ${user.fullName}</h2>

        <p>Your deposit has been approved.</p>

        <p><strong>Amount:</strong> ₹${deposit.amount}</p>

        <p>Your wallet has been credited successfully.</p>

        <br/>

        <p>Investment Platform Team</p>
      `,
    });
  } catch (err) {
    console.log("Deposit Approved Email Error:", err.message);
  }
};
export const sendDepositRejectedEmail = async (
  user,
  deposit,
  remark
) => {
  try {
    await sendEmail({
      to: user.email,
      subject: "Deposit Rejected",
      html: `
        <h2>Hello ${user.fullName}</h2>

        <p>Your deposit request was rejected.</p>

        <p><strong>Amount:</strong> ₹${deposit.amount}</p>

        <p><strong>Reason:</strong> ${remark || "Not Provided"}</p>

        <br/>

        <p>Investment Platform Team</p>
      `,
    });
  } catch (err) {
    console.log("Deposit Rejected Email Error:", err.message);
  }
};
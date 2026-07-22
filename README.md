# Investment Platform

A full-stack Investment Platform built using the MERN Stack. Users can invest in plans, earn daily ROI, manage wallets, withdraw funds, complete KYC verification, and earn referral income. Admins can manage users, investments, deposits, withdrawals, KYC requests, and analytics.

---

## Features

### User
- User Registration & Login
- JWT Authentication
- Dashboard
- Investment Plans
- Wallet Management
- Deposit & Withdrawal
- ROI History
- Transaction History
- KYC Verification
- Referral System (10 Levels)
- Referral Tree
- Logout

### Admin
- Admin Dashboard
- User Management
- Plan Management
- Deposit Approval
- Withdrawal Approval
- KYC Approval
- Transaction Monitoring
- Analytics

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Node Cron
- Cloudinary
- Nodemailer

---

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=
MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=
```

---

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## Author

**Sk Rajib Uddin**

B.Tech CSE Student | MERN Stack Developer

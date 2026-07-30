# Investment Platform

A full-stack MERN Investment Platform that enables users to invest in plans, earn daily ROI, manage wallets, withdraw earnings, complete KYC verification, and build referral networks. The platform also includes a powerful Admin Dashboard for managing users, investments, deposits, withdrawals, transactions, KYC verification, and investment plans.

---

# Live Demo

### Frontend
https://moneyinvestment.netlify.app

### Backend API
https://investment-backend-q9yo.onrender.com

### GitHub Repository
https://github.com/Rajib203/investment_platform

---

# Features

## User Features

- User Registration & Login
- JWT Authentication
- Dashboard
- Investment Plans
- Deposit & Deposit History
- ROI History
- Wallet & Wallet History
- Withdrawal & Withdrawal History
- Referral System
- Referral Income
- Referral Tree
- KYC Verification
- Profile Management
- Logout

## Admin Features

- Admin Registration & Login
- Dashboard
- User Management
- Investment Management
- Deposit Management
- Withdrawal Management
- Transaction Management
- Plan Management
- KYC Management
- Logout

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- React Icons
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Node Cron
- Cloudinary
- Nodemailer
- Express Validator

---

# Application Routes

## User

| Feature | Route |
|---------|-------|
| Register | `/register` |
| Login | `/login` |
| Dashboard | `/dashboard` |
| Profile | `/profile` |
| Investments | `/investments` |
| Deposit | `/deposit` |
| Deposit History | `/user/deposit-history` |
| Wallet | `/wallet` |
| Wallet History | `/wallet/history` |
| Withdrawal | `/withdraw` |
| Withdrawal History | `/withdraw/history` |
| ROI History | `/roi-history` |
| KYC | `/kyc` |
| Direct Referrals | `/referrals` |
| Referral Income | `/referral-income` |
| Referral Tree | `/referral-tree` |

---

## Admin

| Feature | Route |
|---------|-------|
| Register | `/admin/register` |
| Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Users | `/admin/users` |
| Plans | `/admin/plans` |
| Investments | `/admin/investments` |
| Deposits | `/admin/deposits` |
| Withdrawals | `/admin/withdrawals` |
| Transactions | `/admin/transactions` |
| KYC | `/admin/kyc` |

---

# API Endpoints

## Authentication

### User

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/auth/register` |
| POST | `/api/v1/auth/login` |

### Admin

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/admin/register` |
| POST | `/api/v1/admin/login` |

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Rajib203/investment_platform.git
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

## Backend

```env
PORT=

MONGODB_URI=

JWT_SECRET=

JWT_EXPIRE=

EMAIL_HOST=

EMAIL_PORT=

EMAIL_USER=

EMAIL_PASS=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

FRONTEND_URL=
```

## Frontend

```env
VITE_API_URL=
```

---

# Project Structure

```
investment_platform
│
├── backend
│   ├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── cron
│   └── services
│
└── frontend
    ├── src
    ├── components
    ├── pages
    ├── routes
    ├── services
    ├── context
    └── assets
```

---

# Business Logic

- Daily ROI Distribution using Node Cron
- Automatic Wallet Balance Update
- Multi-Level Referral Income Distribution
- Referral Tree Generation
- JWT Authentication
- Role-Based Authorization
- Transaction Management
- Investment Management

---

# Deployment

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas

---

# Author

**Sk Rajib Uddin**

GitHub: https://github.com/Rajib203

---

# License

This project was developed as part of a MERN Stack Developer Technical Assessment and is intended for educational and portfolio purposes.

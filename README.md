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

## Project Structure

```
investment-platform/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env
│
└── README.md
```

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

## Usage

### User Registration

1. Open the application.
2. Click **Register**.
3. Enter:
   - Full Name
   - Email
   - Mobile Number
   - Password
4. Click **Register**.
5. Login using the registered email and password.

### User Login

- URL: `/login`
- Enter your registered email and password.
- After successful login, you will be redirected to the User Dashboard.

### Admin Registration

> Admin accounts cannot be created from the normal user registration page.

To create an admin account, open:

```
/admin/register
```

Fill in the required details and register.

### Admin Login

Open:

```
/admin/login
```

Login using the admin email and password.

After successful login, you will be redirected to the Admin Dashboard.

## Author

**Sk Rajib Uddin**

B.Tech CSE Student | MERN Stack Developer

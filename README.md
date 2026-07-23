# Investment Platform

A full-stack MERN Investment Platform that allows users to invest in plans, earn daily ROI, manage wallets, withdraw earnings, complete KYC verification, and grow income through a referral system. The platform also includes a complete Admin Panel for managing users, investments, deposits, withdrawals, transactions, KYC, and plans.

---

## Live Demo

### Frontend (Netlify)

https://moneyinvestment.netlify.app

### Backend (Render)

https://investment-backend-q9yo.onrender.com

---

## GitHub Repository

https://github.com/Rajib203/investment_platform

---

## Features

### User Features

- User Registration & Login
- JWT Authentication
- Dashboard
- Investment Plans
- Deposit Request
- Deposit History
- ROI History
- Wallet Management
- Wallet History
- Withdrawal Request
- Withdrawal History
- Referral System
- Referral Income
- Referral Tree
- KYC Verification
- Profile Management
- Logout

### Admin Features

- Admin Registration
- Admin Login
- Dashboard
- User Management
- Investment Management
- Deposit Management
- Withdrawal Management
- Transaction Management
- KYC Verification
- Plan Management
- Logout

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- React Icons
- React Hot Toast

### Backend

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

## User Access

### Register

https://moneyinvestment.netlify.app/register

### Login

https://moneyinvestment.netlify.app/login

---

## Admin Access

### Register

https://moneyinvestment.netlify.app/admin/register

### Login

https://moneyinvestment.netlify.app/admin/login

---

# API Endpoints

## User

### Register

POST

```
https://investment-backend-q9yo.onrender.com/api/v1/auth/register
```

### Login

POST

```
https://investment-backend-q9yo.onrender.com/api/v1/auth/login
```

---

## Admin

### Register

POST

```
https://investment-backend-q9yo.onrender.com/api/v1/admin/register
```

### Login

POST

```
https://investment-backend-q9yo.onrender.com/api/v1/admin/login
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Rajib203/investment_platform.git
```

---

### Backend

```bash
cd backend
npm install
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend

```
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

### Frontend

```
VITE_API_URL=
```

---

## Project Structure

```
investment_platform
│
├── backend
│   ├── src
│   ├── routes
│   ├── controllers
│   ├── models
│   ├── middleware
│   ├── cron
│   └── config
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── routes
│   └── context
```

---

## Business Logic

- Daily ROI Distribution using Node Cron
- Automatic Wallet Balance Update
- Referral Income Distribution
- Multi-level Referral Tree
- JWT Protected Routes
- Role-based Authentication
- Transaction History
- Investment Management

---

## Deployment

Frontend deployed on Netlify

Backend deployed on Render

Database hosted on MongoDB Atlas

---

## Author

**Sk Rajib Uddin**

GitHub

https://github.com/Rajib203
---

## License

This project was developed as part of a MERN Stack Developer Technical Assessment and is intended for learning and portfolio purposes.

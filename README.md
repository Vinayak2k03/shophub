# ShopHub – Full-Stack E-Commerce Application

## 📌 Assignment Track
**Full-Stack Development Assignment (E-commerce)**

---

## 🔗 Deployment Link

- **Live Deployment:** https://shophub-liard.vercel.app/

---

## 📖 Project Overview

ShopHub is a **simple full-stack e-commerce web application** where users can browse products, add them to a cart, and place orders.  
An admin can add products and view all orders.

The objective of this project is **not to build a production-ready system**, but to demonstrate:
- Understanding of a common real-world problem
- Clean frontend–backend integration
- Logical API design
- Proper data flow between UI, backend, and database

---

## ✅ Features Implemented

### 👤 User Features
- View list of products
- View product details
- Add products to cart
- Place an order
- View order history

### 🛠️ Admin Features
- Add new products
- View all user orders

(Admin access is role-based)

---

## 🧠 How the Application Works

- The application is built using **Next.js as a full-stack framework**
- Frontend pages are implemented using **Next.js App Router**
- Backend logic is handled via **Next.js API routes and server actions**
- PostgreSQL is used to store users, products, carts, and orders
- Prisma ORM manages database interactions
- Authentication supports **Google OAuth** and **Email + Password with OTP verification**

### Authentication Flow
1. User signs up using email and password  
2. An OTP is sent to the user’s email for verification  
3. After successful verification, the user can log in  
4. Users can alternatively log in using Google OAuth  
5. Role-based access (USER / ADMIN) controls admin functionality  

---

## 🛠️ Tech Stack Used

- **Frontend:** Next.js (App Router), React, TypeScript  
- **Backend:** Node.js (via Next.js API routes)  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Authentication:** Auth.js (NextAuth v5)  
- **Styling:** Tailwind CSS  
- **Deployment:** Vercel (Frontend + Backend), Cloud PostgreSQL  

---

## 🚀 Deployment Details

- **Frontend:** Deployed on Vercel  
- **Backend:** Implemented as serverless APIs using Next.js and deployed on Vercel  
- **Database:** PostgreSQL hosted on a cloud provider (Neon)

This setup keeps the architecture **simple, clean, and easy to explain**, which aligns well with the assignment requirements.

---

## 📁 Project Structure (Simplified)
```
├── app/                    # Next.js App Router
│   ├── (shop)/            # Customer-facing pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # Auth.js configuration
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
├── server/               # Server actions
└── types/                # TypeScript types
```
---

## ⚠️ Assumptions Made

- No payment gateway is implemented (as mentioned in the assignment)
- Admin users are role-based and seeded initially
- Focus is on core functionality rather than advanced optimizations
- Email service is assumed to be available for OTP verification

---

## 🚧 Challenges Faced & Learnings

- Designing a clean authentication flow with OTP verification  
- Implementing role-based access for admin features  
- Structuring the project to clearly separate frontend and backend logic  
- Deploying a full-stack Next.js application with database integration  


---

## 👤 Candidate Details

- **Name:** Vinayak Nagar  
- **Enrollment No.:** E22CSEU0332  
- **Batch:** B12  
- **University:** Bennett University  
- **Role Applied For:** Full Stack Intern


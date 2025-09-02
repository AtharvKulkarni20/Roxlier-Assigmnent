# 📊 RateMe

A full-stack web application where users can **rate stores** on a scale of 1–5.  
It supports multiple user roles (**Admin, Normal User, Store Owner**) with different dashboards and permissions.

---

## ✨ Features

### 👨‍💻 System Administrator
- Add new stores, users (normal/admin), and store owners  
- Dashboard with:  
  - Total number of users  
  - Total number of stores  
  - Total number of submitted ratings  
- View, filter, and manage users and stores  
- View store details including ratings  
- Secure login & logout  

### 🙍 Normal User
- Sign up and log in  
- Update password  
- Browse and search stores by **Name** or **Address**  
- View store listings with:  
  - Store Name  
  - Address  
  - Overall Rating  
  - User’s Submitted Rating  
- Submit or update ratings (1–5)  
- Secure login & logout  

### 🏪 Store Owner
- Log in & update password  
- Dashboard with:  
  - List of users who rated their store  
  - Average store rating  
- Secure login & logout  

---

## 🛠 Tech Stack

| Frontend | Backend | Database | Runtime | Deployment |
|----------|---------|----------|---------|------------|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) | ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)<br>![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white) |

---

## 📋 Form Validations
- **Name:** 20–60 characters  
- **Address:** Up to 400 characters  
- **Password:** 8–16 characters, at least one uppercase + one special character  
- **Email:** Standard email format  

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js & npm  
- MySQL Database  

### Steps
```bash
# Clone the repo
git clone https://github.com/your-username/RateMe.git
cd RateMe

# Install dependencies
cd api
npm install
cd ../client
npm install

# Setup environment variables
# Example for backend (.env)
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=rateme

# Run backend
cd api
npm run dev

# Run frontend
cd client
npm run dev
```
## 📸 Output / Screenshots  



### 🏠 Home Page  

| Home |
|------|
| <img src="client/public/assets/homepage.png" width="600"/> |

---

### 🔐 Authentication Screens  

| Login | Signup |
|-------|--------
| <img src="client/public/assets/Email.png" width="500"/> | <img src="client/public/assets/AddUsers.png" width="500"/> | 
| Password Reset Mail | Forgot Password |
|-----------------|----------------|
| <img src="client/public/assets/ForgotPass.png" width="500"/> | <img src="client/public/assets/Resetpass.png" width="500"/> |
| Reset Password | 
|----------------------|
 <img src="client/public/assets/PasswordResetMail.png" width="500"/> |

---

### 👨‍💻 Admin Dashboard  

| Admin Dashboard |
|-----------------|
| <img src="client/public/assets/AdminDashboard.png" width="400"/> |

---

### 🏪 Store Owner Dashboard  

| Store Owner Dashboard |
|------------------------|
| <img src="client/public/assets/StoreOwnerDash.png" width="400"/> |

---

### 📋 Store Pages  

| Store List | Store Details |
|------------|---------------|
| <img src="client/public/assets/StoreList.png" width="500"/> | <img src="client/public/assets/StoreDetails.png" width="500"/> |



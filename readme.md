

## 📖 Project Description

This is a backend practice project built using **Node.js**, **Express.js**, **MongoDB Atlas**, and other modern backend technologies. The project focuses on learning industry-standard backend development by implementing REST APIs, JWT authentication, file uploads, cloud storage, middleware, and database integration.

This repository also serves as my personal reference, containing setup guides, notes, and workflows that help me understand and recreate the project without revisiting any tutorial.

---

## 👨‍💻 Author

**Akash Mondal**

LinkedIn:  https://www.linkedin.com/in/akashmondal27/

------------------



## 🙏 Acknowledgement

Special thanks to **Hitesh Choudhary** for creating the **Backend with Chai aur Code** series and sharing such valuable backend knowledge with the developer community.

GitHub: https://github.com/hiteshchoudhary

LinkedIn : https://www.linkedin.com/in/hiteshchoudhary/




# 🚀 Backend Project Setup Guide

This document contains all the technologies used during the initial backend setup. It serves as a quick reference for recreating the project without watching the tutorial again.

---

# 📦 Express.js

**What is it?**

Express.js is a minimal and flexible web framework for Node.js used to build REST APIs and backend applications.

**Official Website**

https://expressjs.com/

**Installation**

```bash
npm install express
```

**Why?**

- Create HTTP Server
- Handle Routes
- Use Middleware
- Build REST APIs

---

# 🌱 dotenv

**What is it?**

dotenv loads environment variables from a `.env` file into `process.env`.

**Official Website**

https://www.npmjs.com/package/dotenv

**Installation**

```bash
npm install dotenv
```

**Why?**

- Store Secrets
- Database URL
- API Keys
- Environment Configuration

---

# 🍃 MongoDB Atlas

**What is it?**

MongoDB Atlas is MongoDB's cloud database service.

**Official Website**

https://www.mongodb.com/atlas

**Why?**

- Cloud Database
- Free Cluster
- Secure Storage
- Easy Backup

---

# 🍃 Mongoose

**What is it?**

Mongoose is an ODM (Object Data Modeling) library for MongoDB.

**Official Website**

https://mongoosejs.com/

**Installation**

```bash
npm install mongoose
```

**Why?**

- Create Schemas
- Validation
- CRUD Operations
- Middleware
- Model Methods

---

# 🔑 JWT (jsonwebtoken)

**What is it?**

JWT is used for user authentication and authorization.

**Official Website**

https://jwt.io/

**Installation**

```bash
npm install jsonwebtoken
```

**Why?**

- Login Authentication
- Secure APIs
- Access Token
- Refresh Token

---

# 🔒 bcrypt

**What is it?**

bcrypt hashes passwords before storing them in the database.

**Official Website**

https://www.npmjs.com/package/bcrypt

**Installation**

```bash
npm install bcrypt
```

**Why?**

- Password Security
- Hash Passwords
- Compare Passwords During Login

---

# 📁 Multer

**What is it?**

Multer is middleware for handling `multipart/form-data` (File Upload).

**Official Website**

https://www.npmjs.com/package/multer

**Installation**

```bash
npm install multer
```

**Why?**

- Upload Images
- Temporary Storage
- Handle multipart/form-data

---

# ☁️ Cloudinary

**What is it?**

Cloudinary is a cloud storage service for images and videos.

**Official Website**

https://cloudinary.com/

**Installation**

```bash
npm install cloudinary
```

**Why?**

- Image Storage
- CDN Delivery
- Image Optimization
- No Local Storage

---

# 🍪 cookie-parser

**What is it?**

Reads cookies sent by the client.

**Official Website**

https://www.npmjs.com/package/cookie-parser

**Installation**

```bash
npm install cookie-parser
```

**Why?**

- Read Cookies
- JWT Authentication
- Session Handling

---

# 🌍 CORS

**What is it?**

Allows frontend and backend running on different origins to communicate.

**Official Website**

https://www.npmjs.com/package/cors

**Installation**

```bash
npm install cors
```

**Why?**

- Connect Frontend & Backend
- Allow Cross-Origin Requests
- Secure Origin Control

---

# 🔄 Nodemon

**What is it?**

Automatically restarts the server whenever source code changes.

**Official Website**

https://www.npmjs.com/package/nodemon

**Installation**

```bash
npm install -D nodemon
```

**Why?**

- Automatic Server Restart
- Faster Development
- No Manual Restart

---

# 🎨 Prettier

**What is it?**

Prettier automatically formats code according to predefined rules.

**Official Website**

https://prettier.io/

**Installation**

```bash
npm install prettier
```

**Why?**

- Clean Code
- Consistent Formatting
- Better Readability

---

# 📮 Postman

**What is it?**

Postman is an API testing tool used to test backend APIs without a frontend.

**Official Website**

https://www.postman.com/

**Why?**

- Test APIs
- Organize Requests
- Store Environments
- Manage Authentication
- Debug API Responses

---

# 📦 Package Installation

```bash
npm install express mongoose dotenv bcrypt jsonwebtoken multer cloudinary cookie-parser cors prettier mongoose-aggregate-paginate-v2
```

Development Dependency

```bash
npm install -D nodemon
```

---

# 📌 Initial Backend Workflow

```
Create Project
      │
      ▼
Initialize npm
      │
      ▼
Install Dependencies
      │
      ▼
Create Folder Structure
      │
      ▼
Configure dotenv
      │
      ▼
Connect MongoDB Atlas
      │
      ▼
Create Express Server
      │
      ▼
Configure Middlewares
      │
      ▼
Create Routes
      │
      ▼
Implement Controllers
      │
      ▼
Authentication (JWT)
      │
      ▼
File Upload (Multer)
      │
      ▼
Cloudinary Upload
      │
      ▼
Test APIs using Postman
```
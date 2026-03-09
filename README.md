# 🛍️ AI-Powered E-Commerce Clothing Website

An end-to-end **e-commerce clothing platform** for **men and women**, featuring secure authentication, an admin dashboard for product management, and an **AI-based Style Studio** that generates clothing images from user prompts and recommends similar products using **vector search**.

---

## ✨ Key Features

### 👤 User Features
- User **Signup & Login** with secure authentication
- Browse clothing products for **Men & Women**
- View product details including images, descriptions, and prices
- Add products to cart and proceed with checkout

---

### 🧑‍💼 Admin Dashboard
- Admin authentication
- Product management:
  - ➕ Add new products
  - ✏️ Edit existing products
  - ❌ Delete products
- Manage product categories, pricing, and images

---

### 🎨 Style Studio (AI Feature)
A unique AI-powered feature that enhances the shopping experience:

1. User enters a **text prompt** describing a clothing style  
   _Example: “black oversized streetwear hoodie”_
2. The system **generates an AI image** based on the prompt
3. The generated image is displayed to the user
4. **Vector embeddings** are created from the prompt
5. **Vector search** is used to find and display the most relevant products from the database

This helps users visually explore styles and discover products that best match their preferences.

---

## 🧠 Tech Stack

### Frontend
- React.js
- HTML, CSS, JavaScript
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### AI & Search
- AI-based image generation (prompt-driven)
- **MongoDB Atlas Vector Search**
- Semantic embeddings for product similarity matching

---

env for frontend
```
VITE_APP_BACKEND_LINK=
VITE_RAZORPAY_KEY_ID=
```

env for backend
```
FRONTEND_URL=
PORT=
MONGO_URI=
JWT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
REPLICATE_API_TOKEN=
```


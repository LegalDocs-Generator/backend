
#  Backend Server For LegalDocs Website

This project is a Node.js + Express.js backend server for handling multiple pdf forms generation, with features including:

- User Authentication (JWT)
- Form submission and update
- PDF generation
- Email delivery (via Nodemailer)
- Cloudinary integration for file storage

---

##  Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-repo-url.git
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` File
```env
PORT=8000
appName=
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:6000/api/auth/google/callback
```

---

##  Folder Structure

```
backend/
│
├── authMiddleware/          # JWT & authentication middlewares
├── authService/             # Token generation, auth helpers
├── config/                  # DB, Cloudinary, and Nodemailer setup
│   ├── cloudinary/
│   ├── mongoDBConnection.js
│   └── nodemailer/
│
├── controller/              # All form and user controllers
│   ├── formController/      # Form97 - Form102 logic (submit, get, sendPDF)
│   ├── formGeneration/      # PDF generation logic (puppeteer)
│   ├── formTemplate/        # templates for PDF generation
│   └── userController/      # Signup, login,login with google etc.
│
├── emailService/            # Reusable email functions (via Nodemailer)
├── model/                   # Mongoose models (form97 to form102, user)
├── routes/
│   ├── formRoute/           # Routes for submit/get of forms
│   ├── generateRoute/       # Routes for PDF generation
│   └── userRoute/           # Auth routes (signup/login)
│
├── .env                     # Environment variables
├── server.js                # Entry point
└── README.md                # This file
```

---

##  API Overview

###  Auth Routes (userRoute)
| Method | Endpoint        | Description        |
|--------|------------------|--------------------|
| POST   | `/api/auth/signup`    | Register a user    |
| POST   | `/api/auth/login`     | Login  |
| POST   | `/api/auth/logout` | Logout  |
| GET    | `/api/auth/forget-password` | forget password link        |
| GET    | `/api/auth/reset-password` | reset password link  |
| GET    | `/api/user/profile` | Get user Profile  |
| GET    | `/api/user/profile/update` | Update user profile  |

###  Form Routes (formRoute)
| Method | Endpoint         | Description                    |
|--------|------------------|--------------------------------|
| POST   | `/api/user/forms/submit-form97`        | Submit or update Form 97    |
| POST   | `/api/user/forms/submit-form98`        | Submit or update Form98     |
| POST   | `/api/user/forms/submit-form99`        | Submit or update Form99     |
| POST   | `/api/user/forms/submit-form100`        | Submit or update Form100   |
| POST   | `/api/user/forms/submit-form101`        | Submit or update Form101   |
| POST   | `/api/user/forms/submit-form102`        | Submit or update Form102   |
| GET    | `/api/user/forms/form97`                | Get Form 97 for user           |
| GET    | `/api/user/forms/form98`                | Get Form 98 for user     |
| GET    | `/api/user/forms/form99`                | Get Form 99 for user  |
| GET    | `/api/user/forms/form100`               | Get Form 100 for user  |
| GET    | `/api/user/forms/form101`               | Get Form 101 for user   |
| GET    | `/api/user/forms/form102`               | Get Form 102 for user   |




###  PDF Generation (generateRoute)
| Method | Endpoint           | Description                   |
|--------|--------------------|-------------------------------|
| POST    | `/api/user/forms/send-97`      | Generate + email Form97 PDF   |
| POST    | `/api/user/forms/send-98`      | Generate + email Form98 PDF  |
| POST    | `/api/user/forms/send-99`      | Generate + email Form99 PDF   |
| POST    | `/api/user/forms/send-100`      | Generate + email Form100 PDF  |
| POST    | `/api/user/forms/send-101`      | Generate + email Form101 PDF   |
| POST    | `/api/user/forms/send-102`      | Generate + email Form102 PDF   |

---


##  Email Service

- Configured in `/config/nodemailer/`
- Uses Gmail SMTP (you can switch to SendGrid, Outlook, etc.)

---

##  Cloudinary (Optional)

If you store images/files via Cloudinary (e.g. user uploads), config is in `config/cloudinary/`.

---

##  Tips

- Make sure all models include `userId` so form data is user-specific.
- `authenticate` middleware should populate `req.user.id` and `req.user.email` from the token.
- You can reuse `generateFormXXPDF` logic across all forms.

---

##  Contact

If you face any issue, feel free to reach out or create an issue in the repo.

---

##  License

MIT License © legalDocs Developer Teams

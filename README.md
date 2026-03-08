# GJTS Karnataka Website

Government Junior Technical Schools Karnataka - Official Website

## 🎯 Overview

A comprehensive full-stack web application for managing technical schools across Karnataka, featuring AI-powered grant discovery, alumni management, event coordination, and content management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Dharun78/Uthishta_new.git
cd gjts-karnataka-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other credentials

# Run development server
npm run dev
```

Visit http://localhost:3000

### Default Login Credentials

**Super Admin:**
- Username: `superadmin`
- Password: `admin123`

**School Admin (Bagalkot):**
- Username: `bagalkot_admin`
- Password: `bagalkot123`

## 📚 Features

- **AI-Powered Grants Chatbot** - Intelligent grant matching system
- **Content Management System** - Easy-to-use inline editing
- **Event Management** - Create and manage school events
- **Alumni Network** - Registration and engagement platform
- **Fund Tracking** - Record and monitor donations
- **Custom Pages** - Create pages without coding
- **Email Notifications** - Automated event notifications
- **Role-Based Access** - Super Admin and School Admin roles

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Email:** Nodemailer
- **Deployment:** Vercel-ready

## 📖 Documentation

All documentation files are located in the `logs/` folder:

- `logs/📖_COMPLETE_WEBSITE_OVERVIEW.md` - Complete feature documentation
- `logs/📚_COMPLETE_TECH_STACK_DOCUMENTATION.md` - Technical details
- `logs/VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions
- `logs/🎯_HOW_TO_CREATE_CUSTOM_PAGE.md` - Custom pages guide
- `logs/HOW_TO_USE_GRANTS_CHATBOT.md` - Chatbot usage guide

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Note:** If SMTP credentials are not configured, the email system will run in simulation mode.

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See `logs/VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🤝 Contributing

This is a project for GJTS Karnataka. For contributions or issues, please contact the development team.

## 📄 License

Proprietary - GJTS Karnataka

## 📞 Support

For technical support or questions:
- Check documentation in `logs/` folder
- Review the complete website overview
- Contact the development team

---

**Version:** 1.0.0  
**Last Updated:** March 2026  
**Developed for:** Government Junior Technical Schools Karnataka

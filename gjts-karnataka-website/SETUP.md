# GJTS Karnataka Website - Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

## Installation Steps

### 1. Clone and Install Dependencies
```bash
cd gjts-karnataka-website
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# Update MongoDB URI, API keys, etc.
```

### 3. Start MongoDB
```bash
# Make sure MongoDB is running
# On Windows:
net start MongoDB

# On Linux/Mac:
sudo systemctl start mongod
```

### 4. Start the Backend Server
```bash
npm run server
```
The server will run on http://localhost:5000

### 5. Start the Frontend (in a new terminal)
```bash
npm run dev
```
The website will be available at http://localhost:3000

## Project Structure
```
gjts-karnataka-website/
├── app/                    # Next.js app directory
│   ├── layout.js          # Root layout with navbar/footer
│   ├── page.js            # Homepage
│   ├── globals.css        # Global styles
│   ├── alumni/            # Alumni registration page
│   └── api/               # API routes
│       └── chatbot/       # Chatbot API
├── components/            # React components
│   ├── Navbar.js         # Navigation bar
│   ├── Footer.js         # Footer component
│   ├── ChatBot.js        # AI chatbot widget
│   └── SchoolCard.js     # School display card
├── server/               # Backend server
│   ├── index.js         # Express server
│   └── models/          # MongoDB models
│       └── Alumni.js    # Alumni schema
├── data/                # Static data
│   └── schools-data.json # School information
└── public/              # Static assets
```

## Features

### 1. Homepage
- Hero section with call-to-action
- Statistics showcase
- All 6 schools overview
- Alumni registration CTA

### 2. AI Chatbot
- Trained on school data
- Answers questions about:
  - School locations and details
  - Admissions process
  - Courses offered
  - Facilities
  - Placements
  - Scholarships
- Click the chat icon in bottom-right corner

### 3. Alumni Registration
- Complete registration form
- School-specific registration
- Data stored in MongoDB
- Email verification (optional)

### 4. Premium UI/UX
- Modern, responsive design
- Smooth animations with Framer Motion
- Tailwind CSS styling
- Mobile-first approach
- Accessibility compliant

## API Endpoints

### Alumni APIs
- `POST /api/alumni/register` - Register new alumni
- `GET /api/alumni` - Get all alumni (paginated)
- `GET /api/alumni/school/:school` - Get alumni by school
- `GET /api/alumni/stats` - Get alumni statistics

### Chatbot API
- `POST /app/api/chatbot` - Send message to chatbot

## Customization

### Adding School Images
Place school images in `public/images/` directory:
- ballari.jpg
- bhadravati.jpg
- hubballi.jpg
- bagalkot.jpg
- kalburgi.jpg
- mangalore.jpg

### Updating School Data
Edit `data/schools-data.json` to update:
- School information
- Courses
- Facilities
- Contact details

### Chatbot Training
Modify `app/api/chatbot/route.js` to:
- Add more responses
- Integrate OpenAI API for advanced AI
- Add more school-specific information

## Advanced Features (Optional)

### 1. OpenAI Integration
```javascript
// In app/api/chatbot/route.js
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Use GPT for responses
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are a helpful assistant for GJTS Karnataka schools." },
    { role: "user", content: message }
  ]
})
```

### 2. Email Notifications
Install nodemailer:
```bash
npm install nodemailer
```

Configure in server for alumni registration confirmations.

### 3. Admin Dashboard
Create admin routes for:
- Managing alumni registrations
- Viewing statistics
- Content management

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
vercel deploy
```

### Backend (Railway/Heroku)
```bash
# Add Procfile
echo "web: node server/index.js" > Procfile

# Deploy to Railway or Heroku
```

### Database (MongoDB Atlas)
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

## Support
For issues or questions, contact: info@gjtskarnataka.edu.in

## License
© 2026 Government Junior Technical Schools Karnataka

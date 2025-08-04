# 🧠 MindWell Pro - Mental Wellness Companion

A comprehensive MERN stack application for tracking and improving mental wellness through mood tracking, journaling, goal setting, habit formation, and AI-powered insights.

## 🚀 Features

- **Mood Tracking** - Log daily moods with intensity levels and notes
- **Journaling** - Write and organize personal reflections with tags and categories
- **Goal Management** - Set goals with milestones and track progress
- **Habit Tracking** - Build healthy habits with streak tracking and calendar view
- **Analytics Dashboard** - Visualize wellness data with interactive charts
- **Wellness Tips** - Browse curated mental health tips and recommendations
- **AI Insights** - Get personalized recommendations based on your data
- **Dark/Light Mode** - Customizable theme preferences
- **Responsive Design** - Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router** for navigation
- **React Hook Form** for form handling
- **Date-fns** for date manipulation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Express Validator** for input validation
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Rate Limiting** for API protection

## 📁 Project Structure

```
mindwell-pro/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service functions
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── server/                # Backend Node.js application
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API route definitions
│   ├── config/           # Database configuration
│   └── server.js         # Main server file
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindwell-pro
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `server/` directory:
   ```env
   MONGO_URI=mongodb+srv://bansodems:Mahendra%401120@cluster0.ndt16cp.mongodb.net/mindwell?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   NODE_ENV=development
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Backend will run on: http://localhost:5000

2. **Start the frontend development server**
   ```bash
   # In the root directory
   npm run dev
   ```
   Frontend will run on: http://localhost:5173

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 📡 API Endpoints

### Moods
- `GET /api/moods` - Get all mood entries
- `POST /api/moods` - Create new mood entry
- `GET /api/moods/:id` - Get specific mood entry
- `PUT /api/moods/:id` - Update mood entry
- `DELETE /api/moods/:id` - Delete mood entry

### Journals
- `GET /api/journals` - Get all journal entries
- `POST /api/journals` - Create new journal entry
- `GET /api/journals/:id` - Get specific journal entry
- `PUT /api/journals/:id` - Update journal entry
- `DELETE /api/journals/:id` - Delete journal entry

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get specific goal
- `PUT /api/goals/:id` - Update goal
- `PATCH /api/goals/:id/milestones/:milestoneId` - Toggle milestone completion
- `DELETE /api/goals/:id` - Delete goal

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit
- `PATCH /api/habits/:id/toggle` - Toggle habit completion
- `DELETE /api/habits/:id` - Delete habit

### Tips
- `GET /api/tips` - Get all wellness tips
- `POST /api/tips` - Create new tip
- `GET /api/tips/:id` - Get specific tip
- `PUT /api/tips/:id` - Update tip
- `PATCH /api/tips/:id/complete` - Mark tip as completed
- `DELETE /api/tips/:id` - Delete tip

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/mood-trends` - Get mood trend data

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

## 🎨 Key Features Implementation

### Mood Tracking
- Interactive mood selection with intensity sliders
- Tag system for categorizing moods
- Historical mood data visualization
- Trend analysis and insights

### Journaling
- Rich text editor with markdown support
- Tag-based organization system
- Search and filter functionality
- Word count and reading time calculation

### Goal Management
- Milestone-based progress tracking
- Automatic goal completion when all milestones are done
- Priority and category organization
- Progress visualization with charts

### Habit Tracking
- Calendar-based completion tracking
- Streak calculation and gamification
- Category-based habit organization
- Visual progress indicators

### Analytics Dashboard
- Interactive charts using Recharts
- Mood distribution pie charts
- Weekly trend line graphs
- AI-powered insights and recommendations

## 🔒 Security Features

- Input validation with Express Validator
- Rate limiting to prevent abuse
- CORS configuration for secure cross-origin requests
- Helmet.js for security headers
- MongoDB injection protection

## 🌟 UI/UX Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - System preference detection and manual toggle
- **Smooth Animations** - Framer Motion for delightful interactions
- **Loading States** - Proper loading indicators for all API calls
- **Error Handling** - User-friendly error messages and toast notifications
- **Accessibility** - ARIA labels and keyboard navigation support

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables in your hosting platform
# Deploy the server/ directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)

---

**MindWell Pro** - Your comprehensive mental wellness companion! 🧠✨
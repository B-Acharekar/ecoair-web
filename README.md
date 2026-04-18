# EcoAir | Smart Air Quality System

A next-generation intelligent air purification dashboard built with modern web technologies. Real-time monitoring and control of air quality with ESP32-based sensors and Firebase backend.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)

## 🌍 Features

- **Real-time Air Quality Monitoring** - Live PM2.5, PM10, CO2, temperature, and humidity tracking
- **Intelligent Dashboard** - Visual AQI trends, pollutant dominance analysis, and environmental insights
- **Device Management** - ESP32 sensor device setup, pairing, and status monitoring
- **User Authentication** - Secure login/signup with Firebase Auth
- **Device Control** - Remote purifier control and settings management
- **Responsive Design** - Mobile-friendly glass-morphism UI with smooth animations
- **Real-time Data Sync** - Firestore integration for instant data updates
- **User Profile & Settings** - Account management with device preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project setup
- ESP32 device with sensors

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd ecoair-web
npm install
```

2. **Environment Setup**
Create a `.env.local` file with Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. **Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing/Home page |
| `/login` | User login |
| `/signup` | New user registration |
| `/dashboard` | Main air quality dashboard |
| `/settings` | Device & sensor settings |
| `/profile` | User account & preferences |
| `/city` | City-level air quality data |
| `/setup` | Device initial setup & pairing |
| `/auth` | Authentication handler |

## 🛠️ Tech Stack

- **Framework** - Next.js 14 (App Router)
- **Language** - TypeScript
- **Styling** - Tailwind CSS + Custom CSS
- **Animation** - Framer Motion
- **Backend** - Firebase (Auth, Firestore DB)
- **UI Components** - Custom glass-morphism components
- **Icons** - Lucide React

## 📁 Project Structure

```
ecoair-web/
├── app/
│   ├── api/              # API routes (data, city endpoints)
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main dashboard
│   ├── profile/          # User profile
│   ├── settings/         # Settings & device status
│   ├── setup/            # Device setup
│   ├── city/             # City air quality
│   ├── login/            # Login page
│   ├── signup/           # Sign up page
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── assistant/        # AI assistant components
│   ├── profile/          # Profile components
│   ├── settings/         # Settings components
│   └── setup/            # Setup wizard components
├── context/              # React context (Auth)
├── lib/
│   ├── firebase.ts       # Firebase config
│   ├── theme.ts          # Theme definitions
│   ├── utils.ts          # Utility functions
│   └── mock.ts           # Mock data
└── public/               # Static assets
```

## 🔧 API Endpoints

### `/api/data` - GET
Returns current sensor data:
```json
{
  "timestamp": "2024-04-18T10:30:00Z",
  "pm25": 35.2,
  "pm10": 52.1,
  "co2": 410,
  "temperature": 22.5,
  "humidity": 45
}
```

### `/api/city` - GET
Returns city-level air quality data with AQI calculations.

## 📊 Dashboard Components

- **AQIHero** - Large AQI display with status indicator
- **AQITrendChart** - Historical AQI trend visualization
- **EnvironmentalStats** - Temperature, humidity, pressure metrics
- **PollutantDominance** - PM2.5/PM10 comparison chart
- **ComparisonHero** - Device vs city air quality comparison
- **SyncInsight** - Real-time data synchronization status
- **PurifierControls** - Remote device control interface

## 🎨 UI Components

- **GlassCard** - Glass-morphism card container
- **NeonButton** - Animated neon-effect buttons
- **BackgroundGradient** - Hero section gradients
- **StatusIndicator** - Device/sensor status display
- **RollingNumber** - Animated number transitions
- **Navbar** - Navigation component
- **AssistantOrb** - AI chat assistant UI

## ⚙️ Configuration

### Tailwind CSS
Custom color scheme and animations configured in `tailwind.config.js`:
- Custom colors: primary, secondary, accent, glass
- Custom animations: pulse-glow, float
- Custom utilities: glass-panel, text-glow

### TypeScript
Strict mode enabled with path aliases for clean imports:
- `@/` resolves to project root

## 🔐 Authentication

- Firebase Authentication (Email/Password, Google OAuth)
- Protected routes with AuthContext
- User profile data stored in Firestore
- Session persistence across page reloads

## 📡 Real-time Features

- Firestore real-time listeners for sensor data
- Live device status updates
- Instant purifier control commands
- Automatic data polling (5-second intervals)

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy via Vercel CLI or GitHub integration
```

### Docker
```bash
docker build -t ecoair-web .
docker run -p 3000:3000 ecoair-web
```

## 📝 Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

**CSS Module Error**: Ensure `globals.d.ts` exists in app directory.

**Firebase Connection**: Verify `.env.local` has correct Firebase credentials.

**Device Not Connecting**: Check ESP32 firmware and network connectivity.

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

---

**Built with ❤️ for cleaner air**

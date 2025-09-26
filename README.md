# Gym Tracker

A professional gym tracker Progressive Web App (PWA) designed for personal trainers to manage customers, machines, and workout sessions. Built with React, TypeScript, and Tailwind CSS.

## 🏋️ Features

### Customer Management
- Add and manage customers with contact information
- Quick customer selection for training sessions
- View customer workout history

### Machine Management
- Add gym machines with categories (Cardio, Strength, Functional, Free Weights)
- Organize equipment by type
- Track machine usage across workouts

### Workout Sessions
- **Click-to-edit workouts** - Click any workout to edit it
- Filter workouts by machine
- Track sets, reps, weight, and notes
- Auto-fill machine when filtered
- Complete workout history with sorting

### Multilingual Support
- **Spanish (default)** and English languages
- Language switching in Settings
- Persistent language preference
- Complete UI translation

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface
- Bottom navigation for easy thumb access
- Works as a Progressive Web App (PWA)

### Offline Capability
- All data stored locally using IndexedDB
- Works completely offline
- No external servers required
- Service worker for offline functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd gimnasio-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Database**: IndexedDB (browser-native)
- **PWA**: Vite PWA Plugin with Workbox
- **Internationalization**: Custom i18n system
- **State Management**: React Context + useReducer

## 📱 Usage

### Adding Customers
1. Go to the **Customers** tab
2. Click the **+** button
3. Fill in customer details (name, email, phone)
4. Save the customer

### Adding Machines
1. Go to the **Machines** tab
2. Click the **+** button
3. Enter machine name and select type
4. Save the machine

### Managing Workout Sessions
1. Go to the **Sessions** tab
2. Select a customer from the dropdown
3. Optionally filter by machine
4. View workout history
5. **Click on any workout to edit it**
6. Add new workouts with the **Add Workout** button

### Changing Language
1. Go to the **Settings** tab
2. Select **Español** or **English**
3. The language change applies immediately and is saved locally

## 🗂️ Project Structure

```
src/
├── components/
│   ├── layout/           # Navigation and layout components
│   └── ui/              # Reusable UI components
├── screens/
│   ├── Customers.tsx    # Customer management
│   ├── Machines.tsx     # Machine management
│   ├── Sessions.tsx     # Workout sessions (main feature)
│   └── Settings.tsx     # App settings and language switching
├── services/
│   ├── database.ts      # IndexedDB wrapper
│   ├── customers.ts     # Customer CRUD operations
│   ├── machines.ts      # Machine CRUD operations
│   └── workouts.ts      # Workout CRUD operations
├── i18n/
│   ├── translations.ts  # Spanish and English translations
│   ├── useTranslation.ts # Translation hook
│   └── TranslationProvider.tsx # Translation context
├── context/
│   └── AppContext.tsx   # Global app state
└── types/
    └── index.ts         # TypeScript interfaces
```

## 💾 Data Storage

All data is stored locally in the browser using IndexedDB:

- **Customers**: Name, email, phone, timestamps
- **Machines**: Name, type, timestamps
- **Workouts**: Customer ID, machine ID, date, sets, reps, weight, notes

No data is sent to external servers, ensuring complete privacy and offline functionality.

## 🌐 PWA Features

- **Installable**: Can be installed on mobile devices like a native app
- **Offline-first**: Works without internet connection
- **App-like experience**: Full-screen mode on mobile
- **Service worker**: Caches resources for offline use

## 🔧 Development

### Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting (if configured)

### Adding New Languages
1. Add translations to `src/i18n/translations.ts`
2. Update the `Language` type
3. Add language option in Settings screen

### Customizing Machine Types
Edit the machine types in `src/screens/Machines.tsx` and `src/i18n/translations.ts`.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Gym Tracker** - Professional workout tracking made simple. 🏋️‍♂️
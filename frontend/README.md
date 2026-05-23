# PayFlow - Payment Reconciliation Frontend

A modern, premium fintech payment platform frontend built with React, Tailwind CSS, and Framer Motion. Inspired by Zomato's elegant design language with payment reconciliation focus.

## Features

- ✨ **Modern UI/UX** - Clean, premium interface inspired by Zomato's design language
- 🎬 **Smooth Animations** - Framer Motion animations for engaging interactions
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid development
- ⚡ **Fast Performance** - Optimized with Vite
- 🔐 **Professional Layout** - Enterprise-grade design

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── animations/       # Animation variants
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── assets/           # Images, icons, etc.
│   ├── styles/           # Global styles
│   └── App.jsx          # Main App component
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Key Components

### Landing Page Components
- **Navigation** - Fixed header with responsive menu
- **Hero** - Eye-catching hero section with CTA
- **Features** - 6-column feature grid with icons
- **Stats** - Animated statistics section
- **Testimonials** - Client testimonials
- **CTA** - Call-to-action section
- **Footer** - Comprehensive footer

### Dashboard Pages
- **Dashboard** - Main analytics dashboard
- **Transaction History** - Searchable transaction table

## Design System

### Colors
- **Primary**: Blue (#0284c7) to Cyan (#06b6d4) gradient
- **Dark**: Dark slate (#0f172a, #1e293b)
- **Surface**: Light surfaces with glass effect

### Typography
- Font: System fonts (SF Pro Display, Segoe UI)
- Sizes: Responsive scaling

### Spacing
- Section padding: 6rem (section)
- Grid gaps: 8 units (32px)
- Card padding: 8 units (32px)

## Animation System

Custom animation variants using Framer Motion:
- `fadeInUp` - Fade in with upward movement
- `slideInLeft/Right` - Slide animations
- `scaleIn` - Scale growth animation
- `staggerContainer/Item` - Stagger animations
- `pulseAnimation` - Continuous pulse
- `floatingAnimation` - Floating effect

## Technologies

- **React 18.2** - UI library
- **React Router v6** - Client-side routing
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons
- **Zustand** - State management (ready for integration)

## API Integration

The frontend is configured to proxy API requests to `http://localhost:8000`:
- All `/api/*` requests are forwarded to backend

## Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance Optimizations

- Code splitting with Vite
- Image lazy loading
- Animation performance with Framer Motion GPU acceleration
- CSS optimization with Tailwind

## Getting Started

1. Ensure backend is running on port 8000
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:3000

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Advanced filtering and sorting
- [ ] Real-time notifications
- [ ] User authentication
- [ ] Export functionality
- [ ] Advanced charts and analytics

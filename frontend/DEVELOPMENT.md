# Frontend Development Guide

## Project Overview

PayFlow is a modern, premium fintech payment reconciliation platform frontend. The design is inspired by Zomato's elegant UI/UX principles including:

- Clean, minimalist layout hierarchy
- Smooth, purposeful animations
- Responsive design for all devices
- Premium color gradients and typography
- Generous spacing and whitespace
- Glass-morphism effects
- Micro-interactions and feedback

## Design System

### Color Palette

**Primary Gradient**: Blue to Cyan
- Primary Blue: `#0284c7` (from-blue-600)
- Cyan Accent: `#06b6d4` (to-cyan-600)
- Light backgrounds: `#e0f2fe` (from-blue-100)

**Neutrals**:
- Dark: `#0f172a`, `#1e293b`
- Light: `#f8fafc`, `#ffffff`
- Grays: `#64748b`, `#94a3b8`

**Status Colors**:
- Success: Green
- Warning: Yellow/Orange
- Error: Red
- Info: Blue

### Typography

- Font Stack: SF Pro Display, Segoe UI, system fonts
- H1: 3rem (desktop), 2.5rem (mobile) - Bold
- H2: 2rem (desktop), 1.5rem (mobile) - Bold
- Body: 1rem - Regular
- Small: 0.875rem - Regular

### Spacing System

- xs: 0.5rem (4px)
- sm: 1rem (8px)
- md: 1.5rem (12px)
- lg: 2rem (16px)
- xl: 3rem (24px)
- section: 6rem (96px) - Major sections

### Components

#### Buttons
- **Primary**: Blue gradient with hover scale
- **Secondary**: Outlined with border
- **Disabled**: Gray with reduced opacity

#### Cards
- Rounded corners (12-16px)
- Subtle shadows with hover lift
- Padding: 1.5rem to 2rem
- Light backgrounds optional

#### Forms
- Rounded inputs (8px)
- Blue focus states
- Floating labels (optional)
- Inline validation

## Animation System

### Motion Variants

All animations are defined in `src/animations/motionVariants.js`:

```jsx
import { fadeInUp, slideInLeft, staggerContainer } from '@/animations/motionVariants'

<motion.div variants={fadeInUp} initial="hidden" animate="visible">
  Content
</motion.div>
```

### Animation Types

1. **Entrance Animations**
   - `fadeInUp`: Fade with upward slide
   - `slideInLeft/Right`: Horizontal slide
   - `scaleIn`: Grow from small

2. **Container Animations**
   - `staggerContainer`: Parent for staggered children
   - `staggerItem`: Individual child animation

3. **Loop Animations**
   - `pulseAnimation`: Soft pulsing
   - `floatingAnimation`: Floating effect

### Best Practices

- Use `whileInView` for performance
- Set `viewport={{ once: true }}` to animate once
- Use `transition={{ delay: index * 0.1 }}` for stagger
- Avoid animating too many elements simultaneously

## File Structure Details

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.jsx   # Main navigation bar
│   ├── Hero.jsx         # Hero section
│   ├── Features.jsx     # Features grid
│   ├── Stats.jsx        # Statistics counters
│   ├── Testimonials.jsx # Client testimonials
│   ├── CTA.jsx          # Call-to-action
│   ├── Footer.jsx       # Footer
│   ├── Common.jsx       # Reusable components (Badge, Card, etc.)
│   ├── UI.jsx           # UI utilities (Toast, Modal, etc.)
│   └── PageLayout.jsx   # Layout wrapper
│
├── pages/               # Page components
│   ├── Dashboard.jsx    # Main dashboard
│   └── TransactionHistory.jsx # Transactions view
│
├── hooks/               # Custom React hooks
│   ├── useApi.js        # API fetching hook
│   └── useInView.js     # Intersection observer hook
│
├── services/            # API services
│   └── transactionService.js # Transaction API calls
│
├── utils/               # Utility functions
│   ├── helpers.js       # Formatting, validation
│   └── store.js         # Zustand stores
│
├── types/               # Type definitions
│   └── index.js         # JSDoc type hints
│
├── animations/          # Animation definitions
│   └── motionVariants.js # Framer Motion variants
│
├── assets/              # Images, icons, etc.
├── styles/              # Global styles
│   └── globals.css      # Tailwind + custom CSS
│
└── App.jsx              # Main app router
```

## Common Tasks

### Adding a New Page

1. Create component in `src/pages/YourPage.jsx`
2. Import in `App.jsx`
3. Add route:
   ```jsx
   <Route path="/your-page" element={<YourPage />} />
   ```

### Creating a Reusable Component

1. Create in `src/components/YourComponent.jsx`
2. Export as default
3. Use motion variants for animations
4. Apply Tailwind classes for styling

### Adding API Integration

1. Add function to `src/services/transactionService.js`
2. Use in components with `useApi` hook:
   ```jsx
   const { data, loading, error, fetchData } = useApi('/api/endpoint')
   ```

### Using Animations

```jsx
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/animations/motionVariants'

<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <motion.div variants={fadeInUp}>
    Content
  </motion.div>
</motion.div>
```

## Responsive Design

### Breakpoints
- Mobile (default): < 640px
- Tablet (sm): 640px+
- Desktop (md): 768px+
- Large (lg): 1024px+
- XL (xl): 1280px+

### Pattern Example
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
</div>
```

## Performance Tips

1. **Code Splitting**: Routes are lazy loaded with React Router
2. **Image Optimization**: Use Next.js Image or lazy loading
3. **Animation Performance**: Use GPU-accelerated properties (transform, opacity)
4. **Bundle Size**: Tree-shake unused imports
5. **Monitoring**: Use React DevTools Profiler

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure color contrast meets WCAG AA
- Test with keyboard navigation
- Provide loading states

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 12+, Android 6+

## Debugging

### React DevTools
```bash
# Inspect component tree and props
# Profile rendering performance
```

### Browser DevTools
- Check Network tab for API calls
- Monitor Console for errors
- Use Lighthouse for performance

### Framer Motion DevTools
- Inspect animations in browser
- Validate animation variants

## Environment Variables

Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=PayFlow
VITE_APP_VERSION=1.0.0
```

## Deployment

### Build
```bash
npm run build
```

### Output
- Static files in `dist/`
- Ready for any static host (Vercel, Netlify, etc.)

### Environment
Set production environment variables before deploying.

## Common Issues

### Animations not working
- Check `whileInView` viewport settings
- Verify animation variants are imported
- Check z-index conflicts

### Styling not applying
- Verify Tailwind classes are recognized
- Check specificity of custom CSS
- Clear cache: `npm run build`

### API not connecting
- Check backend URL in `.env`
- Verify backend is running
- Check browser console for CORS errors

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

## Support

For issues or questions:
1. Check this guide
2. Review component examples
3. Check browser console for errors
4. Test with simplified reproduction

---

**Happy coding! 🚀**

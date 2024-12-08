# Ring IG - Modern Image Generation Platform

A modern, feature-rich image generation platform built with React and Vite, following Apple's design principles for a clean and intuitive user experience.

## Features

### Core Functionality
- Advanced image generation with customizable settings
- Aspect ratio selection and style customization
- Real-time image generation status tracking
- Full-screen image viewing capabilities
- Mobile-optimized interface with responsive design

### User Experience
- Masonry grid gallery layout
- Image details dialog with metadata
- Like/Save functionality for images
- Share options for generated images
- Truncatable prompts for better UI
- Loading states and skeleton screens
- Mobile-specific image view optimizations

### Authentication & User Management
- User authentication via Supabase
- Profile management system
- Public profile views
- Notification system
- Pro features support

## Technical Stack

### Frontend Framework & Build Tools
- React 18
- Vite
- React Router DOM for routing

### UI Components & Styling
- shadcn/ui components
- Radix UI primitives
- Tailwind CSS for styling
- Framer Motion for animations
- Embla Carousel
- React Masonry CSS

### State Management & Data Handling
- React Query (TanStack Query)
- React Hook Form
- Zod for validation

### Backend & Authentication
- Supabase for backend services
- Supabase Auth UI for authentication

### Development Tools
- ESLint for code linting
- PostCSS for CSS processing
- Tailwind plugins for enhanced styling

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/        # Configuration files
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations
├── lib/          # Utility libraries
├── pages/        # Main application pages
├── styles/       # Global styles
└── utils/        # Helper functions
```

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with necessary Supabase and other configuration values.

4. Start development server
```bash
npm run dev
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
# Ring IG - Modern AI Image Generation Platform

A sophisticated image generation platform built with React and Vite, implementing Apple's design principles for a clean, modern UI/UX. The platform features AI-powered image generation with multiple models, social features, and a credit-based system.

## Core Features

### Image Generation System
- **Multiple AI Models** [`src/config/modelConfig.js`]
  - Ring.1 turbo: Fast generation with HD support
  - Ring.1: Standard model with flexible settings
  - Ring.1 hyper: Premium model with enhanced quality
  - Ultra: High-quality generation (Premium)
  - Specialized NSFW models (Premium)

- **Generation Settings** [`src/components/ImageGeneratorSettings.jsx`]
  - Quality tiers: HD, HD+, 4K [`src/utils/imageConfigs.js`]
  - 15 aspect ratios from 9:21 to 21:9
  - Customizable inference steps
  - Seed control for reproducibility
  - Style customization options

### Image Management
- **Gallery System** [`src/hooks/useGalleryImages.js`]
  - Infinite scroll with pagination
  - Masonry grid layout
  - Advanced filtering and sorting
  - Public/private image toggle
  - NSFW content filtering

- **Image Processing** [`src/utils/imageOptimization.js`]
  - Responsive image loading
  - WebP format optimization
  - Blur hash generation
  - Multiple quality variants
  - Automatic aspect ratio detection

### AI Features
- **Prompt Enhancement** [`src/utils/promptImprovement.js`]
  - AI-powered prompt improvement
  - Integration with Yi-1.5-34B-Chat model
  - Context-aware enhancements
  - Style-specific optimizations

### User System
- **Authentication** [`src/integrations/supabase/`]
  - PKCE authentication flow
  - Persistent sessions
  - Token management
  - Social login options

- **Profile Management** [`src/pages/UserProfile.jsx`]
  - Custom display names
  - Avatar management
  - Credit tracking
  - Usage statistics
  - Pro user features

### Social Features
- **Interaction System** [`src/hooks/`]
  - Follow/Unfollow users [`useFollows.js`]
  - Like/Unlike images [`useLikes.js`]
  - Image sharing
  - Public profiles
  - Activity tracking

### Credit System [`src/hooks/useUserCredits.js`]
- Tiered pricing model
- Regular and bonus credits
- Pro user benefits
- Credit usage tracking
- Automatic refills

## Technical Architecture

### Frontend Architecture
```
src/
├── components/          # UI Components
│   ├── ui/             # Base UI components (shadcn)
│   └── [feature]/      # Feature-specific components
├── hooks/              # Custom React hooks
│   ├── useImageGeneration.js    # Core generation logic
│   ├── useGalleryImages.js      # Gallery management
│   └── use[Feature].js          # Feature-specific hooks
├── utils/              # Utility functions
│   ├── imageUtils.js            # Image processing
│   ├── promptImprovement.js     # AI enhancement
│   └── retryUtils.js            # Error handling
└── integrations/       # External services
    └── supabase/       # Database & Auth
```

### State Management
- React Query for server state [`src/hooks/useGalleryImages.js`]
- Context API for global state [`src/contexts/NotificationContext.jsx`]
- Custom hooks for feature-specific state
- Real-time updates via Supabase

### Performance Optimizations
- **Image Loading** [`src/utils/imageOptimization.js`]
  - Responsive image sizes
  - Format optimization
  - Progressive loading
  - Caching strategies

- **API Management** [`src/utils/retryUtils.js`]
  - Intelligent retry logic
  - Rate limit handling
  - API key rotation
  - Error recovery

### Security Features
- **Authentication** [`src/integrations/supabase/supabase.js`]
  - Secure token management
  - Session persistence
  - Authorization checks
  - Rate limiting

- **Content Protection**
  - Private image access control
  - NSFW content management
  - API key security
  - User data protection

## Complete File Structure

### Root Directory
```
├── .env                    # Environment variables configuration
├── .eslintrc.cjs          # ESLint configuration
├── components.json         # shadcn/ui components configuration
├── index.html             # Entry HTML file
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite bundler configuration
```

### Source Directory (`src/`)

#### Core Files
- `App.jsx` - Main application component, handles routing and layout
- `main.jsx` - Application entry point, sets up React and providers
- `index.css` - Global CSS styles
- `nav-items.jsx` - Navigation configuration

#### Components (`src/components/`)
```
components/
├── animations/           # Animation components
│   └── HeartAnimation.jsx # Like animation effect
├── filters/             # Filtering components
│   ├── FilterMenu.jsx   # Main filter interface
│   └── PrivateFilterButton.jsx # Private/Public toggle
├── header/             # Header components
│   ├── DesktopHeader.jsx # Desktop navigation header
│   └── MobileHeader.jsx # Mobile navigation header
├── image-card/         # Image card components
│   ├── ImageActions.jsx # Image action buttons
│   └── ImageDetails.jsx # Image metadata display
├── notifications/      # Notification components
│   ├── NotificationBell.jsx # Notification indicator
│   ├── NotificationItem.jsx # Individual notification
│   └── NotificationList.jsx # Notifications container
├── prompt/            # Prompt components
│   └── PromptInput.jsx # AI prompt input interface
├── profile/           # Profile components
│   ├── ProfileHeader.jsx # Profile page header
│   └── ProfileStats.jsx # User statistics display
├── ui/               # Base UI components
│   [Previous UI components remain unchanged]
├── ActionButtons.jsx  # Action button container
├── AspectRatioChooser.jsx # Aspect ratio selector
├── BottomNavbar.jsx  # Mobile navigation bar
├── FullScreenImageView.jsx # Fullscreen view
├── GeneratingImagesDrawer.jsx # Generation progress
├── GeneratingImagesDropdown.jsx # Generation queue
├── ImageCard.jsx     # Image display card
├── ImageCardActions.jsx # Image interactions
├── ImageDetailsDialog.jsx # Image info modal
├── ImageGallery.jsx  # Image grid display
├── ImageGeneratorContent.jsx # Main generator UI
├── ImageGeneratorSettings.jsx # Generator controls
├── ImageStatusIndicators.jsx # Generation status
├── Inspiration.jsx   # Inspiration feed
├── LikeButton.jsx   # Image like button
├── LoadingScreen.jsx # Loading states
├── MobileImageView.jsx # Mobile image viewer
├── MobileNotificationsMenu.jsx # Mobile notifications
├── MobileProfileMenu.jsx # Mobile profile menu
├── MyImages.jsx     # User's images view
├── NoResults.jsx    # Empty state display
├── ProfileMenu.jsx  # Profile dropdown
├── SignInDialog.jsx # Login modal
├── SingleImageView.jsx # Individual image view
├── SkeletonImage.jsx # Loading placeholder
├── SkeletonImageCard.jsx # Card placeholder
├── StyleChooser.jsx # Style selector
├── TruncatablePrompt.jsx # Collapsible prompt
└── theme-provider.jsx # Theme management
```

### Component Details

#### Animation Components
- `HeartAnimation.jsx`: Implements like animation with:
  - Smooth scaling effects
  - Color transitions
  - Interactive feedback

#### Filter Components
- `FilterMenu.jsx`: Advanced filtering system:
  - Model filtering
  - Style filtering
  - Quality filtering
  - Sort options
  - Search integration

- `PrivateFilterButton.jsx`: Privacy toggle with:
  - Public/Private switching
  - Visual indicators
  - Permission checks

#### Header Components
- `DesktopHeader.jsx`: Desktop navigation:
  - User profile access
  - Navigation menu
  - Search functionality
  - Notification center

- `MobileHeader.jsx`: Mobile-optimized header:
  - Compact design
  - Essential actions
  - Responsive menu

#### Notification Components
- `NotificationBell.jsx`: Notification indicator:
  - Unread count
  - Real-time updates
  - Interactive states

- `NotificationItem.jsx`: Individual notifications:
  - Multiple notification types
  - Action handlers
  - Timestamp display
  - Read/Unread states

- `NotificationList.jsx`: Notification container:
  - Virtualized list
  - Load more functionality
  - Group management

#### Prompt Components
- `PromptInput.jsx`: AI prompt interface:
  - Auto-completion
  - Suggestion system
  - Character limits
  - History tracking

#### Image Components
- `ImageCard.jsx`: Main image display:
  - Lazy loading
  - Aspect ratio handling
  - Hover effects
  - Action menu integration

- `ImageCardActions.jsx`: Image interactions:
  - Like functionality
  - Share options
  - Download handling
  - Edit/Delete options

- `ImageDetailsDialog.jsx`: Metadata display:
  - Generation parameters
  - Creation date
  - User attribution
  - Technical details

#### Generator Components
- `ImageGeneratorContent.jsx`: Main generator:
  - Model selection
  - Parameter controls
  - Real-time preview
  - Generation queue

- `ImageGeneratorSettings.jsx`: Advanced settings:
  - Quality controls
  - Size adjustment
  - Style selection
  - Seed management

#### Mobile-Specific Components
- `MobileImageView.jsx`: Mobile optimization:
  - Touch gestures
  - Swipe navigation
  - Responsive layout
  - Performance optimization

- `MobileProfileMenu.jsx`: Mobile profile:
  - Compact navigation
  - Quick actions
  - Settings access
  - User stats

### Library and Utilities (`src/lib/`)
```
lib/
└── utils.js           # Common utility functions
    - Type checking
    - Format conversion
    - String manipulation
    - Common helpers
```

### Styles (`src/styles/`)
```
styles/
├── shadcn-overrides.css # Custom shadcn/ui styling
└── index.css          # Global styles and utilities
```

### Authentication Components (`src/integrations/supabase/components/`)
```
components/
├── AuthProvider.jsx    # Authentication context provider
│   - Session management
│   - User state handling
│   - Token refresh logic
│   - Auth state persistence
├── AuthUI.jsx         # Authentication UI components
│   - Login form
│   - Registration form
│   - Password reset
│   - OAuth providers
│   - Error handling
└── PasswordInput.jsx  # Secure password input
    - Password visibility toggle
    - Strength indicators
    - Validation feedback
```

### Style System Details

#### Global Styles (`index.css`)
- Base styling configuration
- Typography system
- Color variables
- Utility classes
- Dark mode support
- Animation definitions

#### Theme Customization (`shadcn-overrides.css`)
- Component style overrides
- Custom variants
- Brand color system
- Spacing utilities
- Responsive adjustments

### Authentication System Details

#### Auth Provider (`AuthProvider.jsx`)
- Global authentication state
- Session persistence
- Token management
- Real-time auth updates
- Error boundary handling

#### Auth UI (`AuthUI.jsx`)
- Authentication flows
- Social login integration
- Form validation
- Error messaging
- Success handling
- Loading states

#### Password Management (`PasswordInput.jsx`)
- Secure input handling
- Visibility controls
- Strength validation
- Security requirements
- Error feedback

### Supabase Integration Details (`src/integrations/supabase/`)

#### Components
```
components/
├── AuthProvider.jsx    # Authentication context provider
├��─ AuthUI.jsx         # Authentication UI components
└── PasswordInput.jsx  # Secure password input field
```

#### Authentication Components
- `AuthProvider.jsx`: Authentication context:
  - Session management
  - User state handling

### Context System (`src/contexts/`)
```
contexts/
└── NotificationContext.jsx # Global notification management
    - Real-time notifications
    - Toast messages
    - Alert states
    - System messages
```

### Custom Hooks (`src/hooks/`)
```
hooks/
├── useFollowCounts.js    # Follow statistics
├── useFollows.js         # Follow system
├── useGalleryImages.js   # Gallery management
├── useImageFilter.js     # Image filtering
├── useImageGeneration.js # Image generation
├── useImageGeneratorState.js # Generator state
├── useImageHandlers.js   # Image actions
├── useImageLoader.js     # Image loading
├── useImageRemix.js      # Image remixing
├── useLikes.js          # Like system
├── useMediaQuery.js      # Responsive design
├── useModelConfigs.js    # AI model config
├── useProRequest.js      # Pro features
├── useProUser.js         # Pro user state
├── usePromptImprovement.js # AI prompts
├── useRealtimeProfile.js # Profile updates
├── useScrollDirection.js # Scroll handling
├── useStyleConfigs.js    # Style system
└── useUserCredits.js     # Credit system
```

### Hook Details

#### Image Generation Hooks
- `useImageGeneration.js`:
  - AI model integration
  - Generation pipeline
  - Error handling
  - Progress tracking

- `useImageGeneratorState.js`:
  - Form state management
  - Parameter validation
  - History tracking
  - Cache management

#### Social Feature Hooks
- `useFollows.js`:
  - Follow/unfollow logic
  - Relationship tracking
  - Real-time updates
  - Cache invalidation

- `useLikes.js`:
  - Like/unlike handling
  - Counter management
  - Optimistic updates
  - Error recovery

#### Pro Features
- `useProUser.js`:
  - Pro status checking
  - Feature access control
  - Subscription state
  - Premium features

- `useProRequest.js`:
  - Upgrade handling
  - Payment processing
  - Feature unlocking
  - Status updates

#### Utility Hooks
- `useMediaQuery.js`:
  - Responsive breakpoints
  - Device detection
  - Layout switching
  - Screen adaptation

- `useScrollDirection.js`:
  - Scroll tracking
  - Direction detection
  - Position memory
  - Performance optimization

### Supabase Integration Details (`src/integrations/supabase/`)

#### Components
```
components/
├── AuthProvider.jsx    # Authentication context provider
├── AuthUI.jsx         # Authentication UI components
└── PasswordInput.jsx  # Secure password input field
```

#### Authentication Components
- `AuthProvider.jsx`: Authentication context:
  - Session management
  - User state handling

### Pages (`src/pages/`)
```
pages/
├── Documentation.jsx    # Documentation and help
├── ImageGenerator.jsx   # Main generation interface
├── Login.jsx           # Authentication page
├── PublicImageView.jsx # Public image display
├── PublicProfile.jsx   # Public user profiles
├── SharedImageView.jsx # Shared image display
└── UserProfile.jsx     # User settings and profile
```

#### Page Details

##### Main Pages
- `ImageGenerator.jsx`: Core generation page
  - Model selection interface
  - Generation controls
  - Real-time preview
  - Settings management
  - Gallery integration

- `UserProfile.jsx`: Profile management
  - User settings
  - Credit management
  - Image history
  - Statistics display
  - Preference controls

##### Public Pages
- `PublicProfile.jsx`: Public user view
  - Public gallery
  - User statistics
  - Follow button
  - Image grid
  - Activity feed

- `PublicImageView.jsx`: Public image display
  - Image details
  - Creator info
  - Like/Share options
  - Related images
  - Generation details

##### Authentication
- `Login.jsx`: Authentication page
  - Login form
  - Registration
  - Password reset
  - OAuth providers
  - Error handling

##### Documentation
- `Documentation.jsx`: Help center
  - Usage guides
  - Feature documentation
  - API information
  - Pricing details
  - FAQ section

### Utils (`src/utils/`)
```
utils/
├── discardUtils.js     # Image deletion utilities
├── downloadUtils.js    # Image download handling
├── imageConfigs.js     # Image configuration constants
├── imageOptimization.js # Image optimization utilities
├── imageUtils.js       # General image utilities
├── profileUtils.js     # Profile management utilities
├── promptImprovement.js # AI prompt enhancement utilities
└── retryUtils.js       # API retry handling
```

### Key File Descriptions

#### Core Application Files
- `src/App.jsx`: Main application component that handles:
  - Route configuration
  - Authentication flow
  - Layout structure
  - Global providers setup

- `src/main.jsx`: Application entry point containing:
  - React initialization
  - Provider wrapping
  - Global style imports

#### Component Highlights
- `ImageGeneratorContent.jsx`: Core generation interface that:
  - Manages generation workflow
  - Handles user input
  - Displays generation progress
  - Integrates with AI models

- `ImageGeneratorSettings.jsx`: Settings panel for:
  - Model selection
  - Quality configuration
  - Aspect ratio selection
  - Advanced parameters

#### Hook Implementations
- `useImageGeneration.js`: Core generation logic:
  - API communication
  - Error handling
  - Progress tracking
  - Result processing

- `useGalleryImages.js`: Gallery management:
  - Infinite scrolling
  - Image filtering
  - Sorting options
  - Cache management

#### Utility Functions
- `imageOptimization.js`: Image processing utilities:
  - Format conversion
  - Size optimization
  - Quality management
  - Loading optimization

- `retryUtils.js`: API reliability:
  - Retry strategies
  - Error recovery
  - Rate limiting
  - Timeout handling

#### Integration Files
- `supabase/supabase.js`: Database configuration:
  - Client setup
  - Authentication
  - Storage configuration
  - Real-time features

## Development Setup

### Prerequisites
- Node.js 16+
- npm or bun
- Supabase account
- Hugging Face API access

### Environment Variables
```env
VITE_SUPABASE_PROJECT_URL=your_supabase_url
VITE_SUPABASE_API_KEY=your_supabase_key
VITE_HF_API_KEY=your_huggingface_key
```

### Installation
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - Code linting

## Contributing
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License
[License Type] - See LICENSE file for details
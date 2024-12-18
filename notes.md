# Notification System Analysis

## Key Files Structure
1. Context:
   - `src/contexts/NotificationContext.jsx` - Global notification management

2. Components:
   - `src/components/notifications/NotificationBell.jsx` - Notification indicator
   - `src/components/notifications/NotificationItem.jsx` - Individual notification items
   - `src/components/notifications/NotificationList.jsx` - Container for notifications
   - `src/components/MobileNotificationsMenu.jsx` - Mobile-specific notifications view

3. Integration Points:
   - `App.jsx` - NotificationProvider wrapper
   - `DesktopHeader.jsx` - NotificationBell integration
   - `BottomNavbar.jsx` - Mobile notification integration

## NotificationContext Implementation
1. State Management:
   - Uses React Context API
   - Maintains notifications array and unreadCount
   - Integrates with Supabase for real-time updates

2. Key Features:
   - Real-time notification updates via Supabase channels
   - User-specific notifications filtering
   - Automatic unread count management
   - Sorted by creation date (descending)

3. Core Functions:
   - `markAsRead(notificationId)` - Mark notification as read
   - `deleteNotification(notificationId)` - Remove notification
   - `fetchNotifications()` - Get user's notifications

4. Database Integration:
   - Uses Supabase 'notifications' table
   - Real-time subscription to notification changes
   - User-specific filtering using session.user.id

## Component Implementation Details

### NotificationBell
1. Features:
   - Responsive design (mobile/desktop variants)
   - Unread indicator dot
   - Sheet-based notification panel (desktop)
   - Click handler for mobile navigation

2. UI Elements:
   - Bell icon with unread indicator
   - Sheet panel for desktop view
   - Custom styling with Tailwind CSS

### NotificationList
1. Features:
   - Scrollable notification area
   - Empty state handling
   - Responsive height calculation

2. UI Elements:
   - ScrollArea component
   - Empty state with Bell icon
   - Divider between notifications

### NotificationItem
1. Features:
   - Rich notification content display
   - Adaptive layout based on image presence
   - Image support with error handling
   - Multiple link support
   - Read/unread state indication
   - Delete functionality
   - Timestamp formatting

2. Data Structure:
   - Title and message
   - Optional image URLs (comma-separated)
   - Optional links and link names
   - Created timestamp
   - Read/unread state

3. UI Elements:
   - Conditional image preview (w-24 width when present)
   - Full-width text content when no image
   - Title and message text
   - Link buttons
   - Delete button (hover state)
   - Read/unread indicator
   - Timestamp

4. Layout Behavior:
   - With image: Flex layout with 96px image width
   - Without image: Full-width text content
   - Responsive spacing and alignment
   - Consistent padding in both layouts

## Mobile vs Desktop Implementation
1. Desktop:
   - Sheet-based side panel
   - Hover interactions
   - Persistent notification list

2. Mobile:
   - Full-screen notification view
   - Touch-optimized interactions
   - Navigation-based access

## Notification Types Supported
1. Basic notifications:
   - Title
   - Message
   - Timestamp
   - Read/unread state

2. Rich notifications:
   - Images
   - Multiple links
   - Custom link names

## To Analyze Next:
1. Individual component implementations
2. Mobile vs Desktop implementations
3. UI/UX flow and interactions
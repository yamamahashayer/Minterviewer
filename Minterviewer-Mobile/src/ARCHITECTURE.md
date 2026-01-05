# Minterviewer Mobile Architecture

## Overview
A scalable, shared foundation for all user roles (Mentee, Mentor, Company) in the React Native mobile app.

## Architecture Structure

### 1. Shared Foundation
- **BaseLayout**: Common layout with header, theme toggle, notifications
- **BaseNavigator**: Reusable tab navigator component
- **ScrollableTabBar**: Shared expandable tab bar component
- **Navigation Types**: TypeScript interfaces for tab configuration

### 2. Role-Specific Implementations

#### Mentee (Existing - Reference)
- `MenteeLayout.tsx` - Mentee-specific header
- `MenteeNavigator.tsx` - 11 tabs (Overview, Profile, CV, Jobs, Interview, Schedule, Performance, Sessions, Messages, Notifications, Settings)
- Screens in `/screens/mentee/`

#### Mentor (New - Complete)
- `MentorLayout.tsx` - Mentor-specific header
- `MentorNavigator.tsx` - 10 tabs (Dashboard, Profile, Sessions, Calendar, Students, Analytics, Reviews, Messages, Notifications, Settings)
- Screens in `/screens/mentor/`

#### Company (New - Complete)
- `CompanyLayout.tsx` - Company-specific header
- `CompanyNavigator.tsx` - 11 tabs (Dashboard, Profile, Jobs, Candidates, Interviews, Team, Analytics, Reviews, Messages, Notifications, Settings)
- Screens in `/screens/company/`

### 3. Shared Components
- Theme context and colors
- Notification bell component
- Safe area handling
- Consistent styling patterns

### 4. Navigation Pattern
All roles follow the same pattern:
1. Layout provides header with role-specific subtitle
2. Navigator uses ScrollableTabBar for consistent UX
3. Each screen wrapped in appropriate layout
4. Tab configuration arrays for easy maintenance

### 5. Key Benefits
- **Consistency**: Same UX patterns across all roles
- **Scalability**: Easy to add new roles or screens
- **Maintainability**: Shared components reduce duplication
- **Type Safety**: TypeScript interfaces ensure consistency
- **Theme Support**: Unified dark/light theme across roles

### 6. Authentication Integration
The app can now load different navigators based on user role:
```typescript
// Example usage in App.tsx
const renderNavigator = () => {
  switch (userRole) {
    case 'mentee': return <MenteeNavigator />;
    case 'mentor': return <MentorNavigator />;
    case 'company': return <CompanyNavigator />;
    default: return <LoginScreen />;
  }
};
```

## File Structure
```
src/
├── layouts/
│   ├── BaseLayout.tsx          # Shared foundation
│   ├── MenteeLayout.tsx        # Mentee-specific
│   ├── MentorLayout.tsx        # Mentor-specific
│   └── CompanyLayout.tsx       # Company-specific
├── navigation/
│   ├── types.ts                # TypeScript interfaces
│   ├── BaseNavigator.tsx       # Shared navigator
│   ├── MenteeNavigator.tsx     # Mentee navigation
│   ├── MentorNavigator.tsx     # Mentor navigation
│   └── CompanyNavigator.tsx   # Company navigation
└── screens/
    ├── mentee/                 # Mentee screens (existing)
    ├── mentor/                 # Mentor screens (new)
    └── company/                # Company screens (new)
```

## Status: ✅ COMPLETE
All roles now share the same architectural foundation with role-specific implementations.

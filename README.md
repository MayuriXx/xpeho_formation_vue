# Vue 3 + TypeScript + Vite Formation Project

A comprehensive learning project demonstrating Vue 3 with TypeScript, Vite, and modern web development practices. This application showcases routing, state management, authentication, notifications, and data persistence.

## Features

- **Vue 3** with `<script setup>` syntax
- **TypeScript** for type-safe development
- **Vite** for lightning-fast build and development
- **Vue Router** with navigation guards and authentication protection
- **Pinia** for state management with reactive stores
- **Vitest** for unit and integration testing
- **Feature Testing** with BDD-style test scenarios
- **LocalStorage Persistence** for user data
- **Notification System** with auto-dismiss functionality
- **User History Tracking** with change logging
- **Responsive UI** with modern styling

## Project Structure

src/
  ├── components/          # Vue components (Login, Hello, History, etc.)
  ├── composables/         # Reusable composition functions
  ├── features/            # BDD-style feature tests
  ├── router/              # Vue Router configuration
  ├── services/            # Utility services (notifications)
  ├── stores/              # Pinia state management
  ├── types/               # TypeScript type definitions
  ├── App.vue              # Root component
  ├── main.ts              # Application entry point
  └── style.css            # Global styles

## Key Features Explained

### Authentication

- Login page with email validation
- Simple authentication guard (accepts "toto" as valid)
- Protected routes that redirect to login
- Permission toggle for testing

### User Management

- Interactive user profile with editable fields
- Age counter with increment/decrement operations
- Sports selection with checkboxes
- Real-time reactive updates

### Data Persistence

- Automatic saving to localStorage
- Data restoration on app reload
- Reactive storage updates

### History Tracking

- Complete change log of user modifications
- Timestamped entries with action descriptions
- Clear history functionality
- Chronological display

### Notifications

- Service-based notification system
- Multiple notification types (success, error, warning, info)
- Auto-dismiss with configurable duration
- Persistent notifications with zero duration

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

### Run Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test -- --watch
```

## Technology Stack

- **Framework**: Vue 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Testing**: Vitest + Vue Test Utils
- **Code Quality**: ESLint, TypeScript

## Learning Objectives

This project demonstrates:

- Modern Vue 3 composition API patterns
- Type-safe TypeScript development
- Advanced routing with guards
- Reactive state management with Pinia
- Component composition and reusability
- Testing strategies (unit, integration, BDD)
- Form handling and validation
- LocalStorage integration
- Responsive component design

## Notes

- The login accepts "toto" as a valid email for demonstration
- All user data is stored in localStorage
- The app uses English (en-US) locale for date formatting
- Feature tests follow BDD (Behavior-Driven Development) principles

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Guide](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Guide](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

**Formation Project** - Vue 3 learning and best practices demonstration

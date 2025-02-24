# ChronoTrack

A customizable timer application built with React Native that allows users to create, manage, and interact with multiple timers.

## Features

- **Create Custom Timers**: Create timers with custom names, durations, and categories.
- **Category Organization**: Group timers by categories for better organization.
- **Bulk Actions**: Start, pause, or reset all timers in a category with a single tap.
- **Visual Feedback**: Smooth progress bar based on remaining time provide visual indication of progress.
- **Timer History**: Track completed timers with timestamps.
- **Halfway Alerts**: Optional alerts when timers reach halfway point.
- **Haptic Feedback**: Tactile feedback when interacting with timers.
- **Data Persistence**: All timers and settings are stored locally for persistence between app launches.

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/rr789451/ChronoTrack.git
   cd ChronoTrack
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. Run on a device or simulator:
   - Press `i` to open in iOS simulator
   - Press `a` to open in Android simulator
   - Scan the QR code with the Expo Go app on your device

## Project Structure

```
/
├── app/                      # Main app directory (Expo Router)
│   ├── _layout.tsx           # Root layout with bottom tabs navigation
|   |── (tabs)                # Navigation definations  
│       ├── index.tsx         # Home screen (first tab)
│       ├── history.tsx       # History screen (third tab)
│       ├── newTimer.tsx      # Add timer screen (second tab)
│   ├── styles/               # Style definitions
│   │   ├── history.styles.ts # History screen styles
│   │   ├── home.styles.ts    # Home screen styles
│   │   ├── newTimer.styles.ts # New timer form styles
│   │   └── timer.styles.ts   # Timer component styles
│   └── theme/                # Theme definitions
│       └── index.ts          # Theme constants
├── components/               # Reusable components
│   └── Timer.tsx             # Timer component with state and visualization
└── services/                 # Business logic
    └── TimerService.ts       # Timer data management
```

## Implementation Details

- Built with TypeScript for type safety
- Uses React Navigation for screen navigation
- Uses AsyncStorage for data persistence
- Animated API for smooth color transitions
- Context API for state management
- Expo Haptics for tactile feedback

## Development Assumptions

1. Users may have multiple timers running simultaneously.
3. Category grouping helps users organize related timers.
4. Bulk actions improve efficiency when working with multiple timers.
5. Local storage is sufficient for data persistence.

## Future Enhancements

- Theme customization (light/dark mode)
- Cloud sync for timers across devices
- Custom sounds for timer completion
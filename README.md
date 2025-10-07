# What's In My Food

A React Native Expo app that helps you scan food products and check ingredients against your dietary preferences.

## Features

- Barcode scanning using device camera
- Ingredient analysis with smart fuzzy matching
- Track ingredients you want to avoid
- View detailed product information from Open Food Facts database

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm start
\`\`\`

3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Building for Production

To build for Android or iOS:

\`\`\`bash
# For Android
npm run android

# For iOS
npm run ios
\`\`\`

## Project Structure

- `/app` - Main application screens using Expo Router
- `/components` - Reusable React Native components
- `/pages` - Screen components (home, scanner, results)
- `/whatsinmy2/assets` - Images, fonts, and other static assets

## Technologies Used

- Expo SDK 52
- React Native
- Expo Router
- Expo Camera
- React Navigation
- Axios for API calls
- Open Food Facts API

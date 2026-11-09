# What's In My Food

Expo app that allows users to scan food items to avoid selected ingredients. 

Appache license 2.0

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
- `/assets` - Images, fonts, and other static assets

## Technologies Used

- Expo SDK 52
- React Native
- Expo Router
- Expo Camera
- React Navigation
- Axios for API calls
- Open Food Facts API


License:



Copyright 2026 Dylan Bozarth

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

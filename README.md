# React Native Product Listing App

A React Native app that allows users to authenticate and manage product listings. Includes features like login, signup, verification, product CRUD, image uploads, location selection, and more.

## Features

*  **User Authentication**: Login, Signup, Email Verification
*  **Product Listing**: Pagination, Search, and Price Sorting
*  **Image Picker**: Choose images from camera or gallery
*  **MapView**: Tap-to-select and address-based location search
*  **State Management**: Zustand-based authentication and theme stores
*  **Architecture**: Atomic design component structure
*  **Image Swiper**: Swipe through images with long-press to save
*  **Product Detail Screen**: Displays location on map and contact info

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run on iOS:
   ```
   npx react-native run-ios
   ```
4. Run on Android:
   ```
   npx react-native run-android
   ```

## Tech Stack

- React Native  
- TypeScript  
- Zustand   
- React Navigation  
- React Native Maps  
- React Native Image Picker  

## Project Structure

- `src/components` - Reusable UI components  
- `src/screens` - Application screens and views  
- `src/services` - API and backend service integrations  
- `src/stores` - Zustand state management stores

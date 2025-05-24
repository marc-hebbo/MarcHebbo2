# React Native Product Listing App

A React Native app that allows users to authenticate and manage product listings. Includes features like login, signup, verification, product CRUD, image uploads, location selection, and more.

##  Features

*  **User Authentication**: Login, Signup, Email Verification
*  **Product Listing**: Pagination, Search, and Price Sorting
*  **Image Picker**: Choose images from camera or gallery
*  **MapView**: Tap-to-select and address-based location search
*  **State Management**: Zustand-based authentication and theme stores
*  **Architecture**: Atomic design component structure
*  **Image Swiper**: Swipe through images with long-press to save
*  **Product Detail Screen**: Displays location on map and contact info

## ⚠️ Known Issues

Sometimes when submitting a form (e.g., login, signup, add product), it may not respond immediately or fail with a backend error like HTTP 521.

**Possible Causes**:

* Network instability
* Temporary backend downtime

**Solution**:

> If you face this issue, simply try pressing the Submit button again after a moment. This is not a bug in the app — retrying generally resolves the issue.

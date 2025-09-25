# LabChronicleWeb

A comprehensive field data collection and analytics application designed for biology students at the University of the Fraser Valley (UFV). Originally developed as a mobile-only React Native app, LabChronicleWeb has been expanded to support both mobile and web platforms to accommodate budget constraints while maintaining full functionality.

## 🌱 Overview

LabChronicleWeb enables students to collect, manage, and analyze agricultural field data including crop observations, pest monitoring, disease tracking, and beneficial arthropod documentation. The application features location-based data collection with perimeter validation, comprehensive analytics dashboards, and real-time data synchronization.

## ✨ Features

### 📱 Cross-Platform Support
- **Mobile**: Native iOS and Android apps via React Native
- **Web**: Full web browser compatibility using React Native Web
- **Responsive Design**: Optimized for both mobile and desktop experiences

### 📊 Data Collection
- **Crop Monitoring**: Track various crop types (Tropicals, Peppers, Strawberries, Vegetables, Forage)
- **Pest Documentation**: Record spider mites, aphids, thrips, caterpillars, and other pests with count estimates
- **Disease Tracking**: Monitor powdery mildew, blossom end rot, botrytis, and leaf spot
- **Beneficial Arthropods**: Document predator mites, aphidoletes larvae, and other beneficial insects
- **Health Assessment**: Weekly crop health comparisons
- **Location Services**: GPS-based data collection with perimeter validation
- **Notes**: Custom notes for detailed observations

### 📈 Analytics & Reporting
- **Class Analytics**: Comprehensive dashboards for instructors
- **Data Visualization**: Histograms and stacked charts for trend analysis
- **Date Range Filtering**: Flexible time-based data analysis
- **Record Management**: Edit, delete, and resolve data entries
- **Export Capabilities**: Data export for further analysis

### 🔐 User Management
- **Authentication**: Firebase-based user registration and login
- **Class Management**: Create and manage biology classes
- **Student Records**: Individual student data tracking
- **Real-time Sync**: Live data updates across devices

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Web Support**: React Native Web
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Navigation**: React Navigation
- **Charts**: React Native Chart Kit
- **Location**: Expo Location
- **State Management**: React Hooks
- **Styling**: React Native StyleSheet

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LabChronicleWeb.git
   cd LabChronicleWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `src/firebase/config.js` with your Firebase configuration
   - Add your `google-services.json` file to the root directory

4. **Start the development server**
   ```bash
   # For web development
   npm run web
   
   # For mobile development
   npm start
   ```

### Available Scripts

- `npm start` - Start Expo development server
- `npm run web` - Start web development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator

## 📱 Platform-Specific Setup

### Mobile Development
- **Android**: Android Studio with Android SDK
- **iOS**: Xcode (macOS only)
- **Expo Go**: For quick testing on physical devices

### Web Development
- **Browser**: Modern browsers with ES6+ support
- **Responsive**: Optimized for mobile, tablet, and desktop viewports

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DropdownComponent.js
│   ├── MultiSelectComponent.js
│   ├── Histogram.js
│   └── ...
├── screens/            # Application screens
│   ├── Login.js
│   ├── Dashboard.js
│   ├── Records.js
│   ├── ClassAnalytics.js
│   └── ...
├── firebase/           # Firebase configuration
├── fieldDefinitions.js # Data field definitions
└── styles.js          # Global styling
```

## 🔧 Configuration

### Location Services
Update the perimeter coordinates in `src/screens/Records.js`:
```javascript
const point1 = { latitude: YOUR_LAT1, longitude: YOUR_LON1 };
const point2 = { latitude: YOUR_LAT2, longitude: YOUR_LON2 };
```

### Field Definitions
Customize crop types, pests, diseases, and other data fields in `src/fieldDefinitions.js`.

## 📊 Data Schema

The application stores data in Firebase Firestore with the following structure:
- **Users**: Authentication and profile data
- **Records**: Field observations with timestamps and location data
- **Classes**: Class management and student assignments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Educational Use

LabChronicleWeb is specifically designed for educational purposes at UFV. The application supports:
- Field data collection for biology courses
- Agricultural research and monitoring
- Student learning outcomes assessment
- Data-driven agricultural education

## 📞 Support

For support, email [your-email@ufv.ca] or create an issue in this repository.

## 🔄 Version History

- **v1.0.0**: Initial mobile-only release
- **v1.1.0**: Added web compatibility
- **v1.2.0**: Enhanced analytics and reporting features

---

*Developed for the University of the Fraser Valley Biology Department*

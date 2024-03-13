import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dashboard, Settings, Analytics } from '../screens/index';

//Screen names
const homeName = 'Dashboard';
const settingsName = 'Settings';
const analyticsName = 'Analytics';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  const [showAnalyticsTab, setShowAnalyticsTab] = useState(false);

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;

    // Check if the user is logged in and fetch their role
    if (currentUser) {
      const uid = currentUser.uid;
      const userRef = firebase.firestore().collection('users').doc(uid);

      userRef.get().then((doc) => {
        if (doc.exists) {
          const userRole = doc.data().role;

          // Update state to show/hide the Analytics tab based on the user's role
          setShowAnalyticsTab(userRole === 'prof');
        }
      });
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === analyticsName) {
            iconName = focused ? 'trending-up' : 'trending-up';
          } else if (rn === settingsName) {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'rgb(0,112,60)',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          paddingBottom: 10,
          fontSize: 10
        },
        tabBarStyle: [
          {
            display: 'flex',
            height: 60,
            padding: 10
          },
          null
        ]
      })}>

      <Tab.Screen name={homeName} component={Dashboard} />
      {showAnalyticsTab && <Tab.Screen name={analyticsName} component={Analytics} />}
      <Tab.Screen name={settingsName} component={Settings} />

    </Tab.Navigator>
  );
}
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Login, Registration, Records, CreateClass, ClassAnalytics } from '../screens/index';
import MainContainer from '../components/MainContainer.js';

const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'rgb(0,112,60)',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name='Login'
        component={Login}
        options={
          { title: 'Login', headerLeft: null }
        }
      />
      <Stack.Screen
        name='Registration'
        component={Registration}
      />
      <Stack.Screen
        name='Home'
        component={MainContainer}
        options={
          { title: 'Home', headerLeft: null }
        }
      />
      <Stack.Screen
        name='Records'
        component={Records}
        options={
          { title: 'Create Record' }
        }
      />
      <Stack.Screen
        name='CreateClass'
        component={CreateClass}
        options={
          { title: 'Create Class' }
        }
      />
      <Stack.Screen
        name='ClassAnalytics'
        component={ClassAnalytics}
        options={
          { title: 'Class Analytics' }
        }
      />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
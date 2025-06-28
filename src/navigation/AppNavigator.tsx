import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import { ProfileScreen, EditProfileScreen, NotificationsScreen, PrivacyScreen, HelpSupportScreen, AboutScreen } from '../screens';

export type RootStackParamList = {
  MainTabs: undefined;
  Profile: { saveStatus?: 'success' | 'error' } | undefined;
  EditProfile: undefined;
  Notifications: undefined;
  Privacy: undefined;
  HelpSupport: undefined;
  About: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import { LoadingScreen, LoginScreen, SignUpScreen, ProfileScreen, EditProfileScreen, NotificationsScreen, PrivacyScreen, HelpSupportScreen, AboutScreen } from '../screens';
import { authService } from '../services';

export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  SignUp: undefined;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Simulate app initialization/loading time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Check if user is logged in
      const loggedIn = await authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleLogin = async () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
  };

  const handleShowSignUp = () => {
    setShowSignUp(true);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
  };

  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isLoggedIn ? "MainTabs" : "Login"}
      >
        {!isLoggedIn ? (
          <>
            {!showSignUp ? (
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={handleLogin} onSignUp={handleShowSignUp} />}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="SignUp">
                {(props) => <SignUpScreen {...props} onSignUp={handleLogin} onBackToLogin={handleBackToLogin} />}
              </Stack.Screen>
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
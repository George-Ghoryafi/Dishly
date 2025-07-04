import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen, CameraScreen, FavoritesScreen, ShoppingListScreen, LeaderboardScreen } from '../screens';

export type BottomTabParamList = {
  Home: undefined;
  Camera: undefined;
  Favorites: undefined;
  ShoppingList: undefined;
  Leaderboard: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'ShoppingList') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false, // Hide text labels to show only icons
        tabBarButton: (props) => (
          <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={[props.style, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
              {props.children}
            </View>
          </TouchableWithoutFeedback>
        ),
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 80,
          paddingBottom: 10,
        },
        headerShown: false, // Hide the default header
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
      />
      <Tab.Screen 
        name="ShoppingList" 
        component={ShoppingListScreen}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          tabBarStyle: { display: 'none' }, // Hide tab bar on Camera screen
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import NotificationService from './src/services/NotificationService';

// Suppress useInsertionEffect warning
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: useInsertionEffect must not schedule updates']);

export default function App() {
  useEffect(() => {
    // Initialize notifications and setup response handler
    NotificationService.initialize();
    
    const subscription = NotificationService.setupNotificationResponseHandler((response) => {
      console.log('Notification tapped:', response);
      // Here you could navigate to the cooking timer screen
      // This would require navigation context setup
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

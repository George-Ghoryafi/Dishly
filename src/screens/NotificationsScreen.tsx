import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    // TODO: Implement actual notification permission request/revocation
    console.log('Notifications toggled:', value);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="timer-outline" size={40} color="#007AFF" />
          </View>
          <Text style={styles.infoTitle}>Cooking Timer Notifications</Text>
          <Text style={styles.infoDescription}>
            Get notified when your cooking timer finishes so you never miss a step in your recipe.
          </Text>
        </View>

        {/* Toggle Section */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleHeader}>
            <View style={styles.toggleLeft}>
              <Ionicons 
                name={notificationsEnabled ? "notifications" : "notifications-off"} 
                size={24} 
                color={notificationsEnabled ? "#007AFF" : "#666"} 
              />
              <Text style={styles.toggleTitle}>Enable Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          <Text style={styles.toggleDescription}>
            {notificationsEnabled 
              ? "You'll receive notifications when your cooking timer finishes."
              : "You won't receive any notifications from the app."
            }
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What you'll get:</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="alarm" size={20} color="#007AFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Timer Alerts</Text>
              <Text style={styles.featureDescription}>
                Get notified when your cooking timer finishes
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="restaurant" size={20} color="#007AFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Recipe Reminders</Text>
              <Text style={styles.featureDescription}>
                Never miss a step in your cooking process
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Perfect Timing</Text>
              <Text style={styles.featureDescription}>
                Ensure your dishes are cooked to perfection
              </Text>
            </View>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteSection}>
          <View style={styles.noteContainer}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.noteText}>
              Notifications are only used for cooking timers. We don't send promotional or marketing notifications.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  toggleSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featuresSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noteSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 30,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },
});

export default NotificationsScreen; 
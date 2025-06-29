import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleWebsite = () => {
    // TODO: Replace with actual website URL
    Linking.openURL('https://recipic.app');
  };

  const handleTwitter = () => {
    // TODO: Replace with actual Twitter URL
    Linking.openURL('https://twitter.com/recipic');
  };

  const handleInstagram = () => {
    // TODO: Replace with actual Instagram URL
    Linking.openURL('https://instagram.com/recipic');
  };

  const handleEmail = () => {
    // TODO: Replace with actual support email
    Linking.openURL('mailto:support@recipic.app');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo & Title */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="restaurant" size={48} color="#007AFF" />
          </View>
          <Text style={styles.appName}>Recipic</Text>
          <Text style={styles.appTagline}>Your personal cooking companion</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Recipic</Text>
          <Text style={styles.descriptionText}>
            Recipic is your ultimate cooking companion, designed to make your culinary journey 
            easier, more enjoyable, and more rewarding. Whether you're a seasoned chef or just 
            starting your cooking adventure, Recipic provides the tools and inspiration you need 
            to create delicious meals.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="camera" size={24} color="#007AFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Snap & Analyze</Text>
                <Text style={styles.featureDescription}>
                  Take a photo of ingredients and get instant recipe suggestions
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="timer" size={24} color="#007AFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Smart Timers</Text>
                <Text style={styles.featureDescription}>
                  Never overcook again with our intelligent cooking timers
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="heart" size={24} color="#007AFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Recipe Favorites</Text>
                <Text style={styles.featureDescription}>
                  Save and organize your favorite recipes for quick access
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="trending-up" size={24} color="#007AFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Cooking Streaks</Text>
                <Text style={styles.featureDescription}>
                  Track your progress and build consistent cooking habits
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.descriptionText}>
            Recipic is built with love by a team passionate about food, technology, and 
            helping people discover the joy of cooking. We believe that everyone deserves 
            to enjoy delicious, home-cooked meals.
          </Text>
        </View>

        {/* Contact & Social */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleWebsite}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="globe-outline" size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuItemText}>Visit Our Website</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleEmail}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuItemText}>Contact Us</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleTwitter}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="logo-twitter" size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuItemText}>Follow on Twitter</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleInstagram}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="logo-instagram" size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuItemText}>Follow on Instagram</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoText}>© 2024 Recipic. All rights reserved.</Text>
          <Text style={styles.appInfoText}>Made with ❤️ for food lovers everywhere</Text>
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  appTagline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  menuContainer: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  appInfoText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default AboutScreen; 
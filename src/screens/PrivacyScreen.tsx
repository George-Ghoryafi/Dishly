import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type PrivacyScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type PrivacyLevel = 'public' | 'community' | 'private';

const PrivacyScreen: React.FC = () => {
  const navigation = useNavigation<PrivacyScreenNavigationProp>();
  
  // Privacy settings state
  const [imageSharing, setImageSharing] = useState(true);
  const [recipeSharing, setRecipeSharing] = useState(true);
  const [usernameVisibility, setUsernameVisibility] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<PrivacyLevel>('public');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleImageSharingToggle = (value: boolean) => {
    setImageSharing(value);
    // TODO: Implement actual privacy setting update
    console.log('Image sharing toggled:', value);
  };

  const handleRecipeSharingToggle = (value: boolean) => {
    setRecipeSharing(value);
    // TODO: Implement actual privacy setting update
    console.log('Recipe sharing toggled:', value);
  };

  const handleUsernameVisibilityToggle = (value: boolean) => {
    setUsernameVisibility(value);
    // TODO: Implement actual privacy setting update
    console.log('Username visibility toggled:', value);
  };

  const handlePrivacyLevelSelect = (level: PrivacyLevel) => {
    setSelectedLevel(level);
    
    switch (level) {
      case 'public':
        setImageSharing(true);
        setRecipeSharing(true);
        setUsernameVisibility(true);
        break;
      case 'community':
        setImageSharing(true);
        setRecipeSharing(true);
        setUsernameVisibility(false);
        break;
      case 'private':
        setImageSharing(false);
        setRecipeSharing(false);
        setUsernameVisibility(false);
        break;
    }
    
    // TODO: Implement actual privacy setting update
    console.log('Privacy level selected:', level);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="shield-checkmark" size={40} color="#007AFF" />
          </View>
          <Text style={styles.infoTitle}>Your Privacy Controls</Text>
          <Text style={styles.infoDescription}>
            Control how your content is shared with the community. Your privacy is important to us.
          </Text>
        </View>

        {/* Privacy Levels */}
        <View style={styles.privacyLevelsSection}>
          <Text style={styles.sectionTitle}>Privacy Levels</Text>
          
          <TouchableOpacity 
            style={[
              styles.privacyLevel,
              selectedLevel === 'public' && styles.selectedPrivacyLevel
            ]}
            onPress={() => handlePrivacyLevelSelect('public')}
          >
            <View style={styles.levelHeader}>
              <Ionicons name="globe" size={20} color="#007AFF" />
              <Text style={styles.levelTitle}>Public</Text>
              {selectedLevel === 'public' && (
                <Ionicons name="checkmark-circle" size={20} color="#007AFF" style={styles.checkmark} />
              )}
            </View>
            <Text style={styles.levelDescription}>
              All settings enabled. Your content contributes to the community and helps others discover new recipes.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.privacyLevel,
              selectedLevel === 'community' && styles.selectedPrivacyLevel
            ]}
            onPress={() => handlePrivacyLevelSelect('community')}
          >
            <View style={styles.levelHeader}>
              <Ionicons name="people" size={20} color="#007AFF" />
              <Text style={styles.levelTitle}>Community</Text>
              {selectedLevel === 'community' && (
                <Ionicons name="checkmark-circle" size={20} color="#007AFF" style={styles.checkmark} />
              )}
            </View>
            <Text style={styles.levelDescription}>
              Share recipes and images but keep your username private. Balance between contribution and privacy.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.privacyLevel,
              selectedLevel === 'private' && styles.selectedPrivacyLevel
            ]}
            onPress={() => handlePrivacyLevelSelect('private')}
          >
            <View style={styles.levelHeader}>
              <Ionicons name="lock-closed" size={20} color="#007AFF" />
              <Text style={styles.levelTitle}>Private</Text>
              {selectedLevel === 'private' && (
                <Ionicons name="checkmark-circle" size={20} color="#007AFF" style={styles.checkmark} />
              )}
            </View>
            <Text style={styles.levelDescription}>
              All settings disabled. Your content remains completely private and personal.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Individual Settings</Text>
          
          {/* Image Sharing */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name="camera" size={24} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Share My Images</Text>
                <Text style={styles.settingDescription}>
                  {imageSharing 
                    ? "Your food photos may appear in public recipes"
                    : "Your food photos remain private"
                  }
                </Text>
              </View>
            </View>
            <Switch
              value={imageSharing}
              onValueChange={handleImageSharingToggle}
              trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
              thumbColor={imageSharing ? '#fff' : '#f4f3f4'}
            />
          </View>

          {/* Recipe Sharing */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name="restaurant" size={24} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Share My Recipes</Text>
                <Text style={styles.settingDescription}>
                  {recipeSharing 
                    ? "Your recipe generations may be shared with other users"
                    : "Your recipe generations remain private"
                  }
                </Text>
              </View>
            </View>
            <Switch
              value={recipeSharing}
              onValueChange={handleRecipeSharingToggle}
              trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
              thumbColor={recipeSharing ? '#fff' : '#f4f3f4'}
            />
          </View>

          {/* Username Visibility */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name="person" size={24} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Show My Username</Text>
                <Text style={styles.settingDescription}>
                  {usernameVisibility 
                    ? "Your username is visible to the public"
                    : "Your username remains private"
                  }
                </Text>
              </View>
            </View>
            <Switch
              value={usernameVisibility}
              onValueChange={handleUsernameVisibilityToggle}
              trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
              thumbColor={usernameVisibility ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteSection}>
          <View style={styles.noteContainer}>
            <Ionicons name="information-circle" size={20} color="#666" />
            <Text style={styles.noteText}>
              Changes to privacy settings apply to new content. Existing shared content may remain visible based on previous settings.
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
  settingsSection: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  privacyLevelsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  privacyLevel: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  selectedPrivacyLevel: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  levelDescription: {
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
  checkmark: {
    marginLeft: 'auto',
  },
});

export default PrivacyScreen; 
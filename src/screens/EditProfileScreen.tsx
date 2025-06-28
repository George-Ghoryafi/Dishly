import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, BackHandler, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SaveStatus } from '../components';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  
  // Form state
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [username, setUsername] = useState('johndoe');
  const email = 'john.doe@example.com'; // Read-only, would come from user data
  const [membershipStatus] = useState('Free'); // This would come from user data

  // Track original values to detect changes
  const [originalValues, setOriginalValues] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe'
  });

  // Track if user is saving to prevent warning - use ref for immediate access
  const isSavingRef = useRef(false);

  // Success overlay state
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    const hasChanges = !isSavingRef.current && (
      firstName !== originalValues.firstName ||
      lastName !== originalValues.lastName ||
      username !== originalValues.username
    );
    console.log('hasUnsavedChanges:', hasChanges, 'isSaving:', isSavingRef.current);
    return hasChanges;
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleSaveComplete = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    console.log('Save button pressed, setting isSaving to true');
    
    // Dismiss keyboard first
    Keyboard.dismiss();
    
    // Set saving flag immediately to prevent warning
    isSavingRef.current = true;
    
    // TODO: Implement save functionality (API call, etc.)
    // For now, we'll simulate saving by updating the original values
    setOriginalValues({
      firstName,
      lastName,
      username
    });
    
    // Show success animation
    setShowSuccess(true);
  };

  const handleUpgradeMembership = () => {
    // TODO: Navigate to membership upgrade screen
    Alert.alert('Upgrade Membership', 'Navigate to membership upgrade screen');
  };

  // Handle back gesture and hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (hasUnsavedChanges()) {
          Alert.alert(
            'Unsaved Changes',
            'You have unsaved changes. Are you sure you want to leave?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() }
            ]
          );
          return true; // Prevent default back action
        }
        return false; // Allow default back action
      };

      // Add hardware back button listener for Android
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Add navigation listener for back gesture and header back button
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        console.log('beforeRemove triggered, isSaving:', isSavingRef.current);
        if (hasUnsavedChanges()) {
          console.log('Preventing navigation due to unsaved changes');
          // Prevent default action
          e.preventDefault();

          Alert.alert(
            'Unsaved Changes',
            'You have unsaved changes. Are you sure you want to leave?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Leave', 
                style: 'destructive', 
                onPress: () => navigation.dispatch(e.data.action)
              }
            ]
          );
        } else {
          console.log('Allowing navigation - no unsaved changes or saving in progress');
        }
      });

      return () => {
        backHandler.remove();
        unsubscribe();
      };
    }, [firstName, lastName, username, navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[
            styles.saveButton,
            !hasUnsavedChanges() && styles.saveButtonDisabled
          ]}
          disabled={!hasUnsavedChanges()}
        >
          <Text style={[
            styles.saveButtonText,
            !hasUnsavedChanges() && styles.saveButtonTextDisabled
          ]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#666" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.textInput}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Public Username</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{email}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Membership Status</Text>
            <View style={styles.membershipContainer}>
              <View style={styles.membershipInfo}>
                <View style={[
                  styles.membershipBadge,
                  { backgroundColor: membershipStatus === 'Pro' ? '#007AFF' : '#f8f9fa' }
                ]}>
                  <Ionicons 
                    name={membershipStatus === 'Pro' ? 'star' : 'person'} 
                    size={16} 
                    color={membershipStatus === 'Pro' ? '#fff' : '#666'} 
                  />
                  <Text style={[
                    styles.membershipText,
                    { color: membershipStatus === 'Pro' ? '#fff' : '#666' }
                  ]}>
                    {membershipStatus}
                  </Text>
                </View>
                <Text style={styles.membershipDescription}>
                  {membershipStatus === 'Pro' 
                    ? 'Unlimited AI analysis and premium features' 
                    : 'Basic features with limited AI analysis'
                  }
                </Text>
              </View>
              {membershipStatus === 'Free' && (
                <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradeMembership}>
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Success Overlay */}
      <SaveStatus
        visible={showSuccess}
        onComplete={handleSaveComplete}
        message="Profile Updated!"
      />
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
  saveButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  changePhotoText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#666',
    backgroundColor: '#fff',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#666',
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  membershipInfo: {
    flex: 1,
    marginRight: 15,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  membershipText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  membershipDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  upgradeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    minWidth: 80,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EditProfileScreen; 
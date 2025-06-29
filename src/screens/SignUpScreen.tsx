import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SignUpScreenProps {
  onSignUp: () => void;
  onBackToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onBackToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Password strength requirements based on 2024 NIST guidelines
  const getPasswordStrength = (password: string) => {
    // Return default values for empty password
    if (!password || password.length === 0) {
      return {
        requirements: [],
        strength: 0,
        level: 'weak',
        color: '#FF3B30'
      };
    }
    const requirements = [
      {
        id: 'minLength',
        label: 'Minimum 8 characters',
        met: password.length >= 8,
        critical: true
      },
      {
        id: 'uppercase',
        label: 'Contains uppercase letter',
        met: /[A-Z]/.test(password),
        critical: false
      },
      {
        id: 'lowercase',
        label: 'Contains lowercase letter',
        met: /[a-z]/.test(password),
        critical: false
      },
      {
        id: 'number',
        label: 'Contains number',
        met: /[0-9]/.test(password),
        critical: false
      },
      {
        id: 'special',
        label: 'Contains special character',
        met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        critical: false
      },
      {
        id: 'noCommon',
        label: 'Not a common password',
        met: !isCommonPassword(password),
        critical: true
      }
    ];

    const criticalMet = requirements.filter(req => req.critical && req.met).length;
    const totalCritical = requirements.filter(req => req.critical).length;
    const bonusMet = requirements.filter(req => !req.critical && req.met).length;
    const totalBonus = requirements.filter(req => !req.critical).length;

    let strength = 0;
    let level = 'weak';
    let color = '#FF3B30';

    if (criticalMet === totalCritical) {
      strength = 60 + (bonusMet / totalBonus) * 40;
      if (strength >= 90) {
        level = 'excellent';
        color = '#30D158';
      } else if (strength >= 75) {
        level = 'strong';
        color = '#32D74B';
      } else {
        level = 'good';
        color = '#FF9500';
      }
    } else if (criticalMet > 0) {
      strength = (criticalMet / totalCritical) * 40;
      level = 'weak';
      color = '#FF9500';
    }

    return { requirements, strength, level, color };
  };

  const isCommonPassword = (password: string) => {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
      'qwerty123', 'welcome123', 'admin123', 'root', 'toor', 'pass',
      'test', 'guest', 'user', 'login', 'passw0rd', 'p@ssword', 'p@ssw0rd'
    ];
    return commonPasswords.includes(password.toLowerCase());
  };

  const passwordStrength = getPasswordStrength(password);

  // Check username availability (mock implementation)
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock list of taken usernames
      const takenUsernames = ['admin', 'user', 'test', 'dishly', 'chef', 'cook', 'food', 'recipe', 'nathan'];
      const isAvailable = !takenUsernames.includes(username.toLowerCase());
      setUsernameAvailable(isAvailable);
      setIsCheckingUsername(false);
    }, 800);
  };

  // Check username when it changes
  React.useEffect(() => {
    if (username.trim() && username.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(username);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setUsernameAvailable(null);
      setIsCheckingUsername(false);
    }
  }, [username]);

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }

    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return false;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return false;
    }

    // Basic username validation (alphanumeric and underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      Alert.alert('Error', 'Username can only contain letters, numbers, and underscores');
      return false;
    }

    if (usernameAvailable === false) {
      Alert.alert('Error', 'This username is already taken. Please choose another one.');
      return false;
    }

    if (usernameAvailable === null && username.length >= 3) {
      Alert.alert('Error', 'Please wait while we check username availability');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    if (isCommonPassword(password)) {
      Alert.alert('Error', 'Please choose a less common password for better security');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      Alert.alert(
        'Success!', 
        'Account created successfully! You can now sign in with your credentials.',
        [
          {
            text: 'OK',
            onPress: onBackToLogin
          }
        ]
      );
    } catch (error) {
      Alert.alert('Sign Up Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.appName}>Dishly</Text>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Dishly community and start cooking!</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="at-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {username.length >= 3 && (
                <View style={styles.usernameStatus}>
                  {isCheckingUsername ? (
                    <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                  ) : usernameAvailable === true ? (
                    <Ionicons name="checkmark-circle" size={20} color="#30D158" />
                  ) : usernameAvailable === false ? (
                    <Ionicons name="close-circle" size={20} color="#FF3B30" />
                  ) : null}
                </View>
              )}
            </View>

            {username.length >= 3 && usernameAvailable !== null && (
              <View style={styles.usernameMessage}>
                <Text style={[
                  styles.usernameMessageText,
                  { color: usernameAvailable ? '#30D158' : '#FF3B30' }
                ]}>
                  {usernameAvailable 
                    ? '✓ Username is available' 
                    : '✗ Username is already taken'}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.strengthHeader}>
                  <Text style={styles.strengthTitle}>Password Strength</Text>
                  <Text style={[styles.strengthLevel, { color: passwordStrength.color }]}>
                    {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.strengthBarContainer}>
                  <View style={styles.strengthBarBackground}>
                    <View 
                      style={[
                        styles.strengthBarFill, 
                        { 
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color
                        }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.requirementsContainer}>
                  {passwordStrength.requirements.map((req) => (
                    <View key={req.id} style={styles.requirementItem}>
                      <Ionicons 
                        name={req.met ? "checkmark-circle" : "ellipse-outline"} 
                        size={16} 
                        color={req.met ? passwordStrength.color : '#999'} 
                      />
                      <Text style={[
                        styles.requirementText,
                        { 
                          color: req.met ? '#333' : '#666',
                          textDecorationLine: req.met ? 'line-through' : 'none',
                          opacity: req.met ? 0.7 : 1
                        }
                      ]}>
                        {req.label}
                      </Text>
                      {req.critical && (
                        <View style={styles.criticalBadge}>
                          <Text style={styles.criticalBadgeText}>Required</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <View style={styles.strengthTip}>
                  <Ionicons name="information-circle-outline" size={16} color="#007AFF" />
                  <Text style={styles.strengthTipText}>
                    {passwordStrength.level === 'weak' 
                      ? 'Focus on length - longer passwords are more secure than complex short ones!'
                      : passwordStrength.level === 'good'
                      ? 'Good progress! Add more characters or complexity for better security.'
                      : passwordStrength.level === 'strong'
                      ? 'Strong password! Your account will be well protected.'
                      : 'Excellent! This password meets all modern security standards.'}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.comingSoonContainer}>
              <View style={styles.comingSoonContent}>
                <Ionicons name="rocket-outline" size={24} color="#007AFF" />
                <Text style={styles.comingSoonTitle}>More sign-up options coming soon</Text>
                <Text style={styles.comingSoonSubtitle}>We're working on additional ways to join Dishly</Text>
              </View>
            </View>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  termsContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonDisabled: {
    backgroundColor: '#999',
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoonContainer: {
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e6e9ff',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  comingSoonContent: {
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  comingSoonSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  // Password Strength Indicator Styles
  passwordStrengthContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  strengthLevel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  strengthBarContainer: {
    marginBottom: 16,
  },
  strengthBarBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  requirementsContainer: {
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  criticalBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  criticalBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  strengthTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  strengthTipText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  // Username availability styles
  usernameStatus: {
    padding: 4,
  },
  usernameMessage: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  usernameMessageText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SignUpScreen; 
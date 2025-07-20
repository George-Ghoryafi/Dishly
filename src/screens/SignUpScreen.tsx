import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabaseAuthService } from '../services/SupabaseAuthService';
import { EmailConfirmationModal, AlertModal } from '../components';
import { 
  colors, 
  typography, 
  spacing, 
  shadows, 
  componentShadows,
  componentBorderRadius,
  componentSpacing,
  lightTheme
} from '../styles';

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
  const [showEmailConfirmationModal, setShowEmailConfirmationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  // Helper function to show error modal
  const showError = (title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // Check username availability using Supabase
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    
    try {
      const isAvailable = await supabaseAuthService.isUsernameAvailable(username);
      setUsernameAvailable(isAvailable);
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
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
      showError('Error', 'Please enter your first name');
      return false;
    }

    if (!lastName.trim()) {
      showError('Error', 'Please enter your last name');
      return false;
    }

    if (!username.trim()) {
      showError('Error', 'Please enter a username');
      return false;
    }

    if (username.length < 3) {
      showError('Error', 'Username must be at least 3 characters long');
      return false;
    }

    // Basic username validation (alphanumeric and underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      showError('Error', 'Username can only contain letters, numbers, and underscores');
      return false;
    }

    if (usernameAvailable === false) {
      showError('Error', 'This username is already taken. Please choose another one.');
      return false;
    }

    if (usernameAvailable === null && username.length >= 3) {
      showError('Error', 'Please wait while we check username availability');
      return false;
    }

    if (!email.trim()) {
      showError('Error', 'Please enter your email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Error', 'Please enter a valid email address');
      return false;
    }

    if (!password) {
      showError('Error', 'Please enter a password');
      return false;
    }

    if (password.length < 8) {
      showError('Error', 'Password must be at least 8 characters long');
      return false;
    }

    if (isCommonPassword(password)) {
      showError('Error', 'Please choose a less common password for better security');
      return false;
    }

    if (password !== confirmPassword) {
      showError('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await supabaseAuthService.signUp({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
      });

      // Show email confirmation modal instead of alert
      setRegisteredEmail(email.trim());
      setShowEmailConfirmationModal(true);
    } catch (error: any) {
      console.error('Sign up error:', error);
      const message = error?.message || 'Something went wrong. Please try again.';
      showError('Sign Up Failed', message);
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
              <Ionicons name="arrow-back" size={24} color={colors.spiceOrange} />
            </TouchableOpacity>
            <Text style={styles.appName}>Recipic</Text>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Recipic community and start cooking!</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.warmGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor={colors.warmGrayLight}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.warmGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor={colors.warmGrayLight}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="at-outline" size={20} color={colors.warmGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={colors.warmGrayLight}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {username.length >= 3 && (
                <View style={styles.usernameStatus}>
                  {isCheckingUsername ? (
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.warmGray} />
                  ) : usernameAvailable === true ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success.primary} />
                  ) : usernameAvailable === false ? (
                    <Ionicons name="close-circle" size={20} color={colors.error.primary} />
                  ) : null}
                </View>
              )}
            </View>

            {username.length >= 3 && usernameAvailable !== null && (
              <View style={styles.usernameMessage}>
                <Text style={[
                  styles.usernameMessageText,
                  { color: usernameAvailable ? colors.success.primary : colors.error.primary }
                ]}>
                  {usernameAvailable 
                    ? '✓ Username is available' 
                    : '✗ Username is already taken'}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.warmGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={colors.warmGrayLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.warmGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.warmGrayLight}
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
                  color={colors.warmGray} 
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
                        color={req.met ? passwordStrength.color : colors.warmGrayLight} 
                      />
                      <Text style={[
                        styles.requirementText,
                        { 
                          color: req.met ? colors.deepNavy : colors.warmGray,
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
                  <Ionicons name="information-circle-outline" size={16} color={colors.spiceOrange} />
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
              <Ionicons name="lock-closed-outline" size={20} color={colors.warmGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={colors.warmGrayLight}
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
                  color={colors.warmGray} 
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
                <Ionicons name="rocket-outline" size={24} color={colors.spiceOrange} />
                <Text style={styles.comingSoonTitle}>More sign-up options coming soon</Text>
                <Text style={styles.comingSoonSubtitle}>We're working on additional ways to join Recipic</Text>
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

      <EmailConfirmationModal
        visible={showEmailConfirmationModal}
        onClose={() => {
          setShowEmailConfirmationModal(false);
          onBackToLogin();
        }}
        email={registeredEmail}
        type="signup"
      />

      <AlertModal
        visible={showErrorModal}
        title={errorTitle}
        message={errorMessage}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowErrorModal(false),
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Changed from #f5f5f5 to Warm Cream
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l, // Using design system spacing (24px)
    paddingVertical: spacing.l, // 24px
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl, // Using design system spacing (48px)
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: spacing.s, // 8px
    zIndex: 1,
  },
  appName: {
    ...typography.h1, // Using H1 typography (32px, Bold, Deep Navy)
    color: colors.spiceOrange, // Changed from #007AFF to Spice Orange for brand
    marginBottom: spacing.s, // 8px
  },
  welcomeText: {
    ...typography.h3, // Using H3 typography (24px, SemiBold, Deep Navy)
    marginBottom: spacing.s, // 8px
  },
  subtitle: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl, // 32px
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.legacy.white, // White background for inputs
    borderRadius: componentBorderRadius.input, // 12px from design system
    paddingHorizontal: componentSpacing.inputPadding.horizontal, // 16px
    paddingVertical: componentSpacing.inputPadding.vertical, // 16px
    marginBottom: spacing.m, // 16px
    borderWidth: 2,
    borderColor: lightTheme.borders, // #E8E0D8 from design system
    ...componentShadows.input, // Using new shadow system
  },
  inputIcon: {
    marginRight: spacing.m, // 16px
  },
  input: {
    flex: 1,
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.deepNavy, // Changed from #333 to Deep Navy
  },
  eyeIcon: {
    padding: spacing.xs, // 4px
  },
  termsContainer: {
    marginBottom: spacing.l, // 24px
    paddingHorizontal: spacing.xs, // 4px
  },
  termsText: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    textAlign: 'center',
    lineHeight: typography.bodySmall.lineHeight, // Using design system line height
  },
  termsLink: {
    color: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    fontWeight: typography.link.fontWeight, // Medium weight for links
  },
  signUpButton: {
    backgroundColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    borderRadius: componentBorderRadius.button, // 12px from design system
    paddingVertical: componentSpacing.buttonPadding.vertical, // 16px
    paddingHorizontal: componentSpacing.buttonPadding.horizontal, // 24px
    alignItems: 'center',
    marginBottom: spacing.l, // 24px
    ...componentShadows.button, // Using new shadow system
  },
  signUpButtonDisabled: {
    backgroundColor: colors.warmGrayLight, // Changed from #999 to Warm Gray Light
    ...shadows.light, // Lighter shadow for disabled state
  },
  signUpButtonText: {
    ...typography.buttonText, // Using buttonText typography (16px, SemiBold, White)
  },
  comingSoonContainer: {
    backgroundColor: colors.info.background, // Using info background from design system
    borderRadius: componentBorderRadius.card, // 12px from design system
    paddingVertical: spacing.l, // 24px
    paddingHorizontal: spacing.l, // 24px
    marginBottom: spacing.l, // 24px
    borderWidth: 1,
    borderColor: colors.info.border, // Using info border from design system
    ...shadows.light, // Using new shadow system
  },
  comingSoonContent: {
    alignItems: 'center',
  },
  comingSoonTitle: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    marginTop: spacing.m, // 16px
    marginBottom: spacing.xs, // 4px
    textAlign: 'center',
  },
  comingSoonSubtitle: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    textAlign: 'center',
    lineHeight: typography.bodySmall.lineHeight, // Using design system line height
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.l, // 24px
  },
  loginText: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
  },
  loginLink: {
    ...typography.link, // Using link typography (16px, Medium, Spice Orange)
  },
  // Password Strength Indicator Styles
  passwordStrengthContainer: {
    backgroundColor: colors.legacy.white, // White background
    borderRadius: componentBorderRadius.card, // 12px from design system
    padding: spacing.m, // 16px
    marginBottom: spacing.m, // 16px
    ...shadows.light, // Using new shadow system
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m, // 16px
  },
  strengthTitle: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.deepNavy, // Changed from #333 to Deep Navy
  },
  strengthLevel: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    textTransform: 'capitalize' as const,
  },
  strengthBarContainer: {
    marginBottom: spacing.m, // 16px
  },
  strengthBarBackground: {
    height: 8,
    backgroundColor: colors.warmCreamDark, // Using warm cream dark for background
    borderRadius: 4,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  requirementsContainer: {
    marginBottom: spacing.m, // 16px
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs, // 4px
    paddingHorizontal: spacing.xs, // 4px
  },
  requirementText: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    marginLeft: spacing.s, // 8px
    flex: 1,
  },
  criticalBadge: {
    backgroundColor: colors.error.primary, // Using error color from design system
    paddingHorizontal: spacing.s, // 8px
    paddingVertical: spacing.xs, // 4px
    borderRadius: 10,
    marginLeft: spacing.s, // 8px
  },
  criticalBadgeText: {
    fontSize: 10,
    color: colors.legacy.white, // White text
    fontWeight: typography.buttonText.fontWeight, // SemiBold weight
    textTransform: 'uppercase' as const,
  },
  strengthTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.info.background, // Using info background from design system
    padding: spacing.m, // 16px
    borderRadius: componentBorderRadius.input, // 8px
    borderLeftWidth: 3,
    borderLeftColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
  },
  strengthTipText: {
    fontSize: 13,
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    marginLeft: spacing.s, // 8px
    flex: 1,
    lineHeight: 18,
  },
  // Username availability styles
  usernameStatus: {
    padding: spacing.xs, // 4px
  },
  usernameMessage: {
    paddingHorizontal: spacing.xs, // 4px
    marginBottom: spacing.s, // 8px
  },
  usernameMessageText: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    fontWeight: typography.link.fontWeight, // Medium weight
  },
});

export default SignUpScreen; 
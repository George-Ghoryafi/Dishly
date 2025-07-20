import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabaseAuthService } from '../services/SupabaseAuthService';
import { EmailConfirmationModal, AlertModal, ForgotPasswordModal } from '../components';
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

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmationModal, setShowEmailConfirmationModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      setErrorMessage('Please enter both email/username and password');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    
    try {
      await supabaseAuthService.signInWithEmailOrUsername(emailOrUsername, password);
      onLogin();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if it's an email confirmation error
      if (error?.message?.includes('email') && 
          (error.message.includes('confirm') || error.message.includes('not confirmed'))) {
        setPendingEmail(emailOrUsername);
        setShowEmailConfirmationModal(true);
      } else {
        const message = error?.message || 'Please check your credentials and try again';
        setErrorMessage(message);
        setShowErrorModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    onSignUp();
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Recipic</Text>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your culinary journey</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {/* Email or Username Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.warmGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address or username"
              placeholderTextColor={colors.warmGrayLight}
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
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

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotButton} onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Coming Soon Section */}
          <View style={styles.comingSoonContainer}>
            <View style={styles.comingSoonContent}>
              <Ionicons name="rocket-outline" size={24} color={colors.spiceOrange} />
              <Text style={styles.comingSoonTitle}>More sign-in options coming soon</Text>
              <Text style={styles.comingSoonSubtitle}>We're working on additional ways to access Recipic</Text>
            </View>
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <EmailConfirmationModal
        visible={showEmailConfirmationModal}
        onClose={() => setShowEmailConfirmationModal(false)}
        email={pendingEmail}
        type="login"
      />

      <AlertModal
        visible={showErrorModal}
        title="Login Error"
        message={errorMessage}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowErrorModal(false),
          },
        ]}
      />

      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Changed from #f5f5f5 to Warm Cream
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l, // Using design system spacing (24px)
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl, // Using design system spacing (48px)
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.l, // 24px
  },
  forgotText: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    fontWeight: typography.link.fontWeight, // Medium weight for links
  },
  loginButton: {
    backgroundColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    borderRadius: componentBorderRadius.button, // 12px from design system
    paddingVertical: componentSpacing.buttonPadding.vertical, // 16px
    paddingHorizontal: componentSpacing.buttonPadding.horizontal, // 24px
    alignItems: 'center',
    marginBottom: spacing.l, // 24px
    ...componentShadows.button, // Using new shadow system
  },
  loginButtonDisabled: {
    backgroundColor: colors.warmGrayLight, // Changed from #999 to Warm Gray Light
    ...shadows.light, // Lighter shadow for disabled state
  },
  loginButtonText: {
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
  },
  signUpLink: {
    ...typography.link, // Using link typography (16px, Medium, Spice Orange)
  },
});

export default LoginScreen; 
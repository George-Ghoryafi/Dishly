import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmailConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  type: 'signup' | 'login';
  onResendEmail?: () => void;
  isResending?: boolean;
}

const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  visible,
  onClose,
  email,
  type,
  onResendEmail,
  isResending = false,
}) => {
  const getTitle = () => {
    return type === 'signup' 
      ? 'Check Your Email!' 
      : 'Email Not Confirmed';
  };

  const getMessage = () => {
    return type === 'signup'
      ? `We've sent a confirmation email to ${email}. Please check your inbox and click the confirmation link to activate your account.`
      : `Your email address hasn't been confirmed yet. Please check your inbox for the confirmation email and click the link to verify your account.`;
  };

  const getButtonText = () => {
    return type === 'signup' ? 'Got it!' : 'OK';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={type === 'signup' ? 'mail' : 'mail-unread'} 
                    size={48} 
                    color="#007AFF" 
                  />
                </View>
                <Text style={styles.title}>{getTitle()}</Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.message}>{getMessage()}</Text>

                {/* Email display */}
                <View style={styles.emailContainer}>
                  <Ionicons name="mail-outline" size={16} color="#666" />
                  <Text style={styles.emailText}>{email}</Text>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsTitle}>What to do next:</Text>
                  <View style={styles.instructionItem}>
                    <Text style={styles.stepNumber}>1</Text>
                    <Text style={styles.stepText}>Check your email inbox</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <Text style={styles.stepNumber}>2</Text>
                    <Text style={styles.stepText}>Look for an email from Recipic</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <Text style={styles.stepNumber}>3</Text>
                    <Text style={styles.stepText}>Click the confirmation link</Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <Text style={styles.stepNumber}>4</Text>
                    <Text style={styles.stepText}>Return to the app and sign in</Text>
                  </View>
                </View>

                {/* Spam folder note */}
                <View style={styles.spamNote}>
                  <Ionicons name="information-circle-outline" size={16} color="#FF9500" />
                  <Text style={styles.spamText}>
                    Don't see the email? Check your spam/junk folder
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                {onResendEmail && (
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={onResendEmail}
                    disabled={isResending}
                  >
                    <Text style={styles.resendButtonText}>
                      {isResending ? 'Sending...' : 'Resend Email'}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onClose}
                >
                  <Text style={styles.primaryButtonText}>{getButtonText()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    marginBottom: 32,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  emailText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 8,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  spamNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
  },
  spamText: {
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
  },
  resendButton: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  resendButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmailConfirmationModal; 
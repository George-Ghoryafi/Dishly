import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
}) => {
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
                  <Ionicons name="key" size={40} color="#007AFF" />
                </View>
                <Text style={styles.title}>Forgot Password?</Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.message}>
                  Don't worry! Password reset functionality is coming soon.
                </Text>

                <View style={styles.comingSoonContainer}>
                  <Ionicons name="rocket-outline" size={24} color="#007AFF" />
                  <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
                  <Text style={styles.comingSoonSubtitle}>
                    We're working on a secure password reset feature that will let you:
                  </Text>
                </View>

                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Ionicons name="mail-outline" size={16} color="#007AFF" />
                    <Text style={styles.featureText}>Reset password via email</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#007AFF" />
                    <Text style={styles.featureText}>Secure verification process</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="time-outline" size={16} color="#007AFF" />
                    <Text style={styles.featureText}>Quick and easy recovery</Text>
                  </View>
                </View>

                <View style={styles.helpContainer}>
                  <Ionicons name="information-circle-outline" size={16} color="#FF9500" />
                  <Text style={styles.helpText}>
                    In the meantime, if you need help accessing your account, please contact our support team.
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => {
                    // TODO: Implement contact support
                    onClose();
                  }}
                >
                  <Text style={styles.contactButtonText}>Contact Support</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeButtonText}>Got it</Text>
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
    maxWidth: 380,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
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
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  comingSoonContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6e9ff',
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
    marginBottom: 4,
  },
  comingSoonSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
  },
  helpText: {
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  actions: {
    gap: 10,
  },
  contactButton: {
    backgroundColor: '#f8f9ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  contactButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordModal; 
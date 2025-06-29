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

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  icon,
  iconColor = '#007AFF',
}) => {
  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'cancel':
        return styles.cancelButton;
      case 'destructive':
        return styles.destructiveButton;
      default:
        return styles.defaultButton;
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case 'cancel':
        return styles.cancelButtonText;
      case 'destructive':
        return styles.destructiveButtonText;
      default:
        return styles.defaultButtonText;
    }
  };

  const getIconName = () => {
    if (icon) return icon;
    
    // Auto-select icon based on title/message content
    const content = `${title} ${message}`.toLowerCase();
    if (content.includes('error') || content.includes('failed') || content.includes('wrong')) {
      return 'alert-circle';
    } else if (content.includes('success') || content.includes('created') || content.includes('complete')) {
      return 'checkmark-circle';
    } else if (content.includes('warning') || content.includes('confirm')) {
      return 'warning';
    } else {
      return 'information-circle';
    }
  };

  const getIconColor = () => {
    if (iconColor !== '#007AFF') return iconColor;
    
    const content = `${title} ${message}`.toLowerCase();
    if (content.includes('error') || content.includes('failed') || content.includes('wrong')) {
      return '#FF3B30';
    } else if (content.includes('success') || content.includes('created') || content.includes('complete')) {
      return '#30D158';
    } else if (content.includes('warning') || content.includes('confirm')) {
      return '#FF9500';
    } else {
      return '#007AFF';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => buttons[0]?.onPress?.()}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.modal}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={getIconName()} 
                  size={40} 
                  color={getIconColor()} 
                />
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Message */}
              <Text style={styles.message}>{message}</Text>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      getButtonStyle(button.style),
                      buttons.length === 1 && styles.singleButton,
                      index === 0 && buttons.length > 1 && styles.firstButton,
                      index === buttons.length - 1 && buttons.length > 1 && styles.lastButton,
                    ]}
                    onPress={button.onPress}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.buttonText,
                      getButtonTextStyle(button.style)
                    ]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
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
    maxWidth: 320,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
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
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  singleButton: {
    backgroundColor: '#007AFF',
  },
  firstButton: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  lastButton: {
    backgroundColor: '#007AFF',
  },
  defaultButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultButtonText: {
    color: '#fff',
  },
  cancelButtonText: {
    color: '#007AFF',
  },
  destructiveButtonText: {
    color: '#fff',
  },
});

export default AlertModal; 
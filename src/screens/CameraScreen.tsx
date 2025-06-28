import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Animated } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedAnimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CameraScreen: React.FC = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageSource, setImageSource] = useState<'camera' | 'gallery' | null>(null);
  const [zoom, setZoom] = useState(0);
  
  const cameraRef = useRef<CameraView>(null);
  const captureButtonScale = useRef(new Animated.Value(1)).current;
  
  // Zoom animation values
  const zoomScale = useSharedValue(1);
  const savedZoom = useSharedValue(0);
  const zoomIndicatorOpacity = useSharedValue(0);

  // Update zoom value from gesture
  const updateZoom = (newZoom: number) => {
    const clampedZoom = Math.max(0, Math.min(1, newZoom));
    setZoom(clampedZoom);
  };

  // Show zoom indicator temporarily
  const showZoomIndicator = () => {
    zoomIndicatorOpacity.value = withSpring(1);
    setTimeout(() => {
      zoomIndicatorOpacity.value = withSpring(0);
    }, 1500);
  };

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedZoom.value = zoom;
    })
    .onUpdate((event) => {
      const newZoom = savedZoom.value + (event.scale - 1) * 0.5;
      zoomScale.value = event.scale;
      runOnJS(updateZoom)(newZoom);
      runOnJS(showZoomIndicator)();
    })
    .onEnd(() => {
      zoomScale.value = withSpring(1);
      savedZoom.value = zoom;
    });

  // Zoom indicator animated style
  const zoomIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: zoomIndicatorOpacity.value,
      transform: [
        {
          scale: interpolate(
            zoomIndicatorOpacity.value,
            [0, 1],
            [0.8, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  // Handle back navigation
  const handleBackPress = () => {
    if (capturedImage) {
      setCapturedImage(null);
      setImageSource(null);
    } else {
      navigation.goBack();
    }
  };

  // Toggle camera facing (front/back)
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Toggle flash
  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  // Capture photo from camera
  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      
      // Animate capture button
      Animated.sequence([
        Animated.timing(captureButtonScale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(captureButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setCapturedImage(photo.uri);
        setImageSource('camera');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to select images from your gallery.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setImageSource('gallery');
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to pick image from gallery. Please try again.');
    }
  };

  // Retake photo
  const retakePicture = () => {
    setCapturedImage(null);
    setImageSource(null);
  };

  // Use/save the captured photo
  const usePhoto = () => {
    if (capturedImage) {
      const source = imageSource === 'camera' ? 'camera' : 'gallery';
      Alert.alert(
        'Photo Selected!', 
        `Photo from ${source} has been selected successfully. You can now implement functionality to analyze or use this photo.`,
        [
          { text: 'OK', onPress: () => {
            setCapturedImage(null);
            setImageSource(null);
          }}
        ]
      );
    }
  };

  // Check permissions
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionContent}>
            <Ionicons name="camera-outline" size={80} color="#666" />
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionMessage}>
              Dishly needs access to your camera to take photos of ingredients and dishes.
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Show captured image preview
  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          {/* Preview Header */}
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.previewTitle}>
              {imageSource === 'camera' ? 'Photo Preview' : 'Gallery Image'}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Preview Controls */}
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.previewButton} onPress={retakePicture}>
              <Ionicons 
                name={imageSource === 'camera' ? 'camera-outline' : 'images-outline'} 
                size={24} 
                color="#fff" 
              />
              <Text style={styles.previewButtonText}>
                {imageSource === 'camera' ? 'Retake' : 'Choose Again'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.previewButton, styles.useButton]} onPress={usePhoto}>
              <Ionicons name="checkmark" size={24} color="#fff" />
              <Text style={styles.previewButtonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Main camera view
  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={pinchGesture}>
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flash}
            zoom={zoom}
          >
            {/* Camera Header */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Take Photo</Text>
              <TouchableOpacity onPress={toggleFlash} style={styles.headerButton}>
                <Ionicons 
                  name={flash === 'on' ? 'flash' : 'flash-off'} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>

            {/* Zoom Indicator */}
            <ReanimatedAnimated.View style={[styles.zoomIndicator, zoomIndicatorStyle]}>
              <View style={styles.zoomIndicatorContainer}>
                <Text style={styles.zoomIndicatorText}>{Math.round(zoom * 100)}%</Text>
              </View>
            </ReanimatedAnimated.View>

            {/* Camera Controls */}
            <View style={styles.cameraControls}>
              <TouchableOpacity onPress={toggleCameraFacing} style={styles.controlButton}>
                <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
              </TouchableOpacity>

              {/* Capture Button */}
              <Animated.View style={[styles.captureButton, { transform: [{ scale: captureButtonScale }] }]}>
                <TouchableOpacity 
                  style={styles.captureButtonInner}
                  onPress={takePicture}
                  disabled={isCapturing}
                >
                  <View style={styles.captureButtonIcon} />
                </TouchableOpacity>
              </Animated.View>

              {/* Gallery Button */}
              <TouchableOpacity onPress={pickImageFromGallery} style={styles.galleryButton}>
                <Ionicons name="images-outline" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Camera Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Take a photo or choose from gallery
              </Text>
            </View>
          </CameraView>
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    color: '#666',
    fontSize: 16,
  },
  cameraHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  zoomIndicatorContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  zoomIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionsText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  previewHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 44,
  },
  previewControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: 'center',
  },
  useButton: {
    backgroundColor: '#007AFF',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CameraScreen; 
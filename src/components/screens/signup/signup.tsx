import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
  ScrollView,
  ImageBackground,
  TextInput,
  Alert,
  Image,
  ActionSheetIOS,
  PermissionsAndroid,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { signUpSchema, SignUpFormData } from '../../../utils/validation/signupSchema';
import { Input } from '../../../Input';
import { Button } from '../../../Button';
import { ButtonVariant } from '../../../Button/Button.type';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import backgroundImage from '../../../../assets/images/background.png';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../../stores/authStore';
import API from '../../../services/axios';

type RootStackParamList = {
  Login: undefined;
  SignUp: { email: string };
  Verification: { email: string };
};

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { setLoggedIn } = useAuthStore();
  const [image, setImage] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to take photos.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const requestLibraryPermission = async () => {
    if (Platform.OS === 'android') {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission, {
        title: 'Storage Permission',
        message: 'App needs access to your photos to upload images.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      });

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const chooseImageSource = () => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const cancelButtonIndex = 2;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            const granted = await requestCameraPermission();
            if (granted) takePhoto();
            else Alert.alert('Permission required', 'Camera permission is needed.');
          } else if (buttonIndex === 1) {
            const granted = await requestLibraryPermission();
            if (granted) pickFromLibrary();
            else Alert.alert('Permission required', 'Photo library access is needed.');
          }
        }
      );
    } else {
      Alert.alert('Select Image', '', [
        {
          text: 'Take Photo',
          onPress: async () => {
            const granted = await requestCameraPermission();
            if (granted) takePhoto();
            else Alert.alert('Permission required', 'Camera permission is needed.');
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const granted = await requestLibraryPermission();
            if (granted) pickFromLibrary();
            else Alert.alert('Permission required', 'Storage permission is needed.');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]);
    }
  };

  const pickFromLibrary = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const onSubmit = async (data: SignUpFormData) => {
    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('phone', data.phone);

      if (image) {
        formData.append('profileImage', {
          uri: Platform.OS === 'android' ? image.uri : image.uri?.replace('file://', ''),
          name: image.fileName || 'photo.jpg',
          type: image.type || 'image/jpeg',
        } as any);
      }

      const response = await API.post('api/auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        useAuthStore.getState().signUpSuccess(data.email);
        Alert.alert('Success', 'Account created! Please verify your email.');
      } else {
        Alert.alert('Error', 'Signup failed');
      }
    } catch (error: any) {
      console.log('Signup error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.container}
      imageStyle={{ opacity: 1 }}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.topSafeArea} />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
                <Animatable.Text animation="fadeInUp" duration={300} style={styles.title}>
                  Create Account
                </Animatable.Text>

                <Animatable.View animation="fadeInUp" delay={300} duration={900}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="First Name:"
                        placeholder="Type your first name"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.firstName?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => lastNameRef.current?.focus()}
                      />
                    )}
                  />
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={200} duration={600}>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={lastNameRef}
                        label="Last Name:"
                        placeholder="Type your last name"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.lastName?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                      />
                    )}
                  />
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={300} duration={600}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={emailRef}
                        label="Email:"
                        placeholder="Enter your email"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.email?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => phoneRef.current?.focus()}
                      />
                    )}
                  />
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={400} duration={800}>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={phoneRef}
                        label="Phone Number:"
                        placeholder="Enter your phone number"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.phone?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                      />
                    )}
                  />
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={500} duration={800}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={passwordRef}
                        label="Password:"
                        placeholder="Enter your password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        error={errors.password?.message}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
                      />
                    )}
                  />
                </Animatable.View>

                <TouchableOpacity
                  onPress={chooseImageSource}
                  style={{ marginVertical: 12, alignSelf: 'center' }}
                >
                  <Text style={{ color: 'white', textDecorationLine: 'underline' }}>
                    Choose Profile Image
                  </Text>
                </TouchableOpacity>

                {image && (
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 12 }}
                  />
                )}

                <Animatable.View animation="fadeInUp" delay={600} duration={600} style={styles.buttonContainer}>
                  <Button
                    variant={ButtonVariant.PRIMARY}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>

                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.linkText, { textDecorationLine: 'underline' }]}>
                      Already have an account? Login
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default SignupScreen;
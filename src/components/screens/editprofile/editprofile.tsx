import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActionSheetIOS,
  Text,
  PermissionsAndroid,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Input } from '../../../Input';
import { Button } from '../../../Button';
import { ButtonVariant } from '../../../Button/Button.type';
import {
  editProfileSchema,
  EditProfileFormData,
} from '../../../utils/validation/editProfileSchema';
import axiosInstance from '../../../services/axios';
import styles from './styles';
import { RootStackParamList } from '../../../navigation/navigation'; 

type ProfileEditNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileEdit'
>;

const DEFAULT_AVATAR = require('../../../../assets/images/logo.png');

export const ProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<ProfileEditNavigationProp>();

  const [image, setImage] = useState<Asset | null>(null);
  const originalImageUri = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { firstName: '', lastName: '' },
    mode: 'onChange',
  });

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your photo library.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/api/user/profile');
        const user = res.data.data.user;

        reset({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
        });

        const uri = user.profileImage?.url
          ? axiosInstance.defaults.baseURL + user.profileImage.url
          : null;

        originalImageUri.current = uri;
        setImage(uri ? ({ uri, fileName: uri.split('/').pop() } as Asset) : null);
      } catch (error) {
        Alert.alert('Error', 'Unable to load profile data.');
        navigation.navigate('ProductList');
      }
    };

    fetchProfile();
  }, [navigation, reset]);

  const takePhoto = async (): Promise<void> => {
    const ok = await requestCameraPermission();
    if (!ok) {
      Alert.alert('Permission denied', 'Camera permission is required.');
      return;
    }

    const res = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert('Camera Error', res.errorMessage || 'Unknown error');
      return;
    }
    if (res.assets?.length) {
      setImage(res.assets[0]);
    }
  };

  const pickFromLibrary = async (): Promise<void> => {
    const ok = await requestStoragePermission();
    if (!ok) {
      Alert.alert('Permission denied', 'Storage permission is required.');
      return;
    }

    const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert('Library Error', res.errorMessage || 'Unknown error');
      return;
    }
    if (res.assets?.length) {
      setImage(res.assets[0]);
    }
  };

  const chooseImageSource = (): void => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 2 },
        idx => {
          if (idx === 0) takePhoto();
          else if (idx === 1) pickFromLibrary();
        }
      );
    } else {
      Alert.alert('Select Image', undefined, [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const imageChanged = image?.uri !== originalImageUri.current;
  const formChanged = Object.keys(dirtyFields).length > 0;
  const isSaveDisabled = !(formChanged || imageChanged) || loading;

  const onSubmit = async (data: EditProfileFormData) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('firstName', data.firstName);
      fd.append('lastName', data.lastName);

      if (image && imageChanged) {
        const uri =
          Platform.OS === 'android' && !image.uri!.startsWith('file://')
            ? `file://${image.uri}`
            : image.uri!;
        fd.append('profileImage', {
          uri,
          name: image.fileName || 'photo.jpg',
          type: image.type || 'image/jpeg',
        } as any);
      }

      const res = await axiosInstance.put('/api/user/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', res.data?.data?.message || 'Profile updated!');

      const profileRes = await axiosInstance.get('/api/user/profile');
      const user = profileRes.data.data.user;
      const newUri = user.profileImage?.url
        ? axiosInstance.defaults.baseURL + user.profileImage.url
        : null;
      originalImageUri.current = newUri;
      setImage(newUri ? ({ uri: newUri, fileName: newUri.split('/').pop() } as Asset) : null);

      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    } catch {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={chooseImageSource} style={styles.imagePicker} activeOpacity={0.7}>
          <Image source={image?.uri ? { uri: image.uri } : DEFAULT_AVATAR} style={styles.image} />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        <Controller
          control={control}
          name="firstName"
          render={({ field }) => (
            <Input
              label="First Name:"
              placeholder="Enter first name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.firstName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field }) => (
            <Input
              label="Last Name:"
              placeholder="Enter last name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.lastName?.message}
            />
          )}
        />

        <Button variant={ButtonVariant.PRIMARY} onPress={handleSubmit(onSubmit)} disabled={isSaveDisabled}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;

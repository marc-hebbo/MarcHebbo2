import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { launchImageLibrary } from 'react-native-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { Trash2 } from 'lucide-react-native';
import { styles } from './styles';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0.01, 'Price must be greater than 0'),
});
export type FormData = z.infer<typeof productSchema>;

type ProductFormScreenProps = {
  onSubmitHandler: (data: FormData, images: any[], location: any) => Promise<void>;
  initialValues?: Partial<FormData>;
  initialImages?: any[];
  initialLocation?: any;
  submitButtonLabel?: string;
  titleText?: string;
  isEditing?: boolean;
};

export const ProductFormScreen: React.FC<ProductFormScreenProps> = ({
  onSubmitHandler,
  initialValues = {},
  initialImages = [],
  initialLocation = null,
  submitButtonLabel = 'Submit',
  titleText = 'Product Form',
  isEditing = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialValues.title || '',
      description: initialValues.description || '',
      price: initialValues.price || 0,
    },
  });

  const watchedTitle = watch('title');
  const watchedDescription = watch('description');
  const watchedPrice = watch('price');

  const [images, setImages] = useState(initialImages);
  const [location, setLocation] = useState(initialLocation);
  const [region, setRegion] = useState({
    latitude: initialLocation?.latitude || 37.78825,
    longitude: initialLocation?.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [locationInput, setLocationInput] = useState(initialLocation?.name || '');
const pickImages = async () => {
  if (images.length >= 5) {
    Alert.alert('Limit reached', 'You can upload up to 5 images');
    return;
  }

  try {
    if (Platform.OS === 'android') {
      try {
        const permissionToRequest =
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permissionToRequest);
        console.log('Permission result:', granted);

        if (
          granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot access gallery without permission');
          return;
        }
      } catch (permError) {
        console.warn('Permission request error:', permError);
        Alert.alert('Error', 'Failed to request permissions');
        return;
      }
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 5 - images.length,
    });

    if (!result) return;
    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Unknown error while picking image');
      return;
    }
    if (result.assets) {
      const picked = result.assets
        .filter((a) => a.uri)
        .map((a) => ({
          uri: a.uri!,
          name: a.fileName || 'image.jpg',
          type: a.type || 'image/jpeg',
        }));
      setImages((prev) => [...prev, ...picked]);
    }
  } catch (error) {
    console.warn('Image picker error:', error);
    Alert.alert('Error', 'Something went wrong while picking images');
  }
};


  const deleteImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a location to search');
      return;
    }
//here  i am using i am using the api for the map isntead of goggle cloud api(it works fine)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=1`,
        { headers: { 'User-Agent': 'MyReactNativeApp/1.0', Accept: 'application/json' } }
      );

      const data = await response.json();
      if (data.length) {
        const place = data[0];
        const loc = {
          name: place.display_name,
          latitude: parseFloat(place.lat),
          longitude: parseFloat(place.lon),
        };
        setLocation(loc);
        setRegion({ ...region, latitude: loc.latitude, longitude: loc.longitude });
        setLocationInput(place.display_name);
      } else {
        Alert.alert('Error', 'Location not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location');
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!location) {
      Alert.alert('Validation Error', 'Please select a location');
      return;
    }
    if (images.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one image');
      return;
    }

    await onSubmitHandler(data, images, location);
  };

  const isFormChanged =
    watchedTitle !== (initialValues.title || '') ||
    watchedDescription !== (initialValues.description || '') ||
    watchedPrice !== (initialValues.price || 0);

  const areImagesChanged = JSON.stringify(images) !== JSON.stringify(initialImages);
  const isLocationChanged = JSON.stringify(location) !== JSON.stringify(initialLocation);

  const isChanged = isFormChanged || areImagesChanged || isLocationChanged;
  const isDisabled = isEditing && !isChanged;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>{titleText}</Text>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.title && styles.errorInput]}
              placeholder="Enter title"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.description && styles.errorInput]}
              placeholder="Enter description"
              multiline
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              textAlignVertical="top"
              numberOfLines={4}
            />
          )}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

        {/* Price */}
        <Text style={styles.label}>Price</Text>
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.price && styles.errorInput]}
              placeholder="Enter price"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={(val) => onChange(parseFloat(val) || 0)}
              value={value?.toString()}
            />
          )}
        />
        {errors.price && <Text style={styles.errorText}>{errors.price.message}</Text>}

        {/* Images */}
        <Text style={styles.label}>Images</Text>
        <View style={styles.imagesContainer}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity style={styles.trashIcon} onPress={() => deleteImage(index)}>
                <Trash2 size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
              <Text style={styles.addImageText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <View style={styles.rowAlignCenter}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            placeholder="Search location"
            value={locationInput}
            onChangeText={setLocationInput}
            onSubmitEditing={() => searchLocation(locationInput)}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.locationButton} onPress={() => searchLocation(locationInput)}>
            <Text style={styles.locationButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={(e) => {
            const coord = e.nativeEvent.coordinate;
            const loc = {
              name: 'Custom Location',
              latitude: coord.latitude,
              longitude: coord.longitude,
            };
            setLocation(loc);
            setRegion({ ...region, latitude: coord.latitude, longitude: coord.longitude });
            setLocationInput(`Lat: ${coord.latitude.toFixed(4)}, Lon: ${coord.longitude.toFixed(4)}`);
          }}
        >
          {location && <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />}
        </MapView>

        <TouchableOpacity
          style={[styles.submitButton, isDisabled && { backgroundColor: '#ccc' }]}
          onPress={handleSubmit(handleFormSubmit)}
          disabled={isDisabled}
        >
          <Text style={styles.submitButtonText}>{submitButtonLabel}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

import React, { useEffect, useState } from 'react';
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








import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MapView, { Marker } from 'react-native-maps';
import { launchImageLibrary } from 'react-native-image-picker';
import API from '../../../services/axios';
import { styles } from './styles';
import { RootStackParamList } from '../proddetailsscreen';
import { useAuthStore } from '../../../stores/authStore';
import { Trash2 } from 'lucide-react-native';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
});

type FormData = z.infer<typeof productSchema>;
type RouteParams = RouteProp<RootStackParamList, 'EditProduct'>;

export const EditProductScreen = () => {
  const { params } = useRoute<RouteParams>();
  const navigation = useNavigation();
  const accessToken = useAuthStore((s) => s.accessToken);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(productSchema) });

  const [images, setImages] = useState<{ uri: string; name: string; type: string }[]>([]);
  const [location, setLocation] = useState<{ name: string; latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [locationInput, setLocationInput] = useState('');





  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/products/${params.productId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = res.data.data;

        setValue('title', data.title);
        setValue('description', data.description);
        setValue('price', data.price);
        setImages(
          data.images.map((img: any, index: number) => ({
            uri: `${API.defaults.baseURL}${img.url}`, 
            name: `image${index}.jpg`,
            type: 'image/jpeg',
          }))
        );
        setLocation(data.location);
        setLocationInput(data.location?.name || '');
        setRegion({
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to load product');
        navigation.goBack();
      }
    };

    fetchProduct();
  }, [params.productId]);

  const pickImages = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit reached', 'You can upload up to 5 images');
      return;
    }

    try {
      if (Platform.OS === 'android') {
        const permissionToRequest =
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permissionToRequest);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot access gallery without permission');
          return;
        }
      }

      launchImageLibrary(
        { mediaType: 'photo', selectionLimit: 5 - images.length },
        (response) => {
          if (response.didCancel) return;
          if (response.errorCode) {
            Alert.alert('Error', response.errorMessage || 'Unknown error');
            return;
          }

          if (response.assets) {
            const picked = response.assets.map((a) => ({
              uri: a.uri || '',
              name: a.fileName || 'image.jpg',
              type: a.type || 'image/jpeg',
            }));
            setImages((prev) => [...prev, ...picked]);
          }
        }
      );
    } catch (err) {
      Alert.alert('Error', 'Could not open gallery');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const onSubmit = async (data: FormData) => {
    if (!location) {
      Alert.alert('Error', 'Location is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', String(data.price));
      formData.append('location[name]', location.name);
      formData.append('location[latitude]', String(location.latitude));
      formData.append('location[longitude]', String(location.longitude));
      images.forEach((img) => {
        if (img.uri.startsWith('http')) {
        } else {
          formData.append('images', {
            uri: img.uri,
            name: 
            img.name,
            type: img.type,
          
          
          
          }
          
          as any);
        }
      });

      await API.put(`/api/products/${params.productId}`, formData, {
        headers: {
          Authorization:
           `Bearer ${accessToken}`,
          
           'Content-Type': 
           'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Product updated');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update product');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <TextInput value={value} onChangeText={onChange} placeholder="Title" style={styles.input} />
          )}
        />
        {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <TextInput value={value} onChangeText={onChange} placeholder="Description" style={styles.input} />
          )}
        />
        {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

        <Text style={styles.label}>Price</Text>
        <Controller
          control={control}
          name="price"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={String(value)}
              onChangeText={onChange}
              placeholder="Price"
              style={styles.input}
              keyboardType="decimal-pad"
            />
          )}
        />
        {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => removeImage(index)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2 size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity style={styles.image} onPress={pickImages}>
              <Text style={styles.addImageText}>+ Add</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <Text style={styles.label}>Location</Text>
        <TextInput
          value={locationInput}
          onChangeText={setLocationInput}
          style={styles.input}
          placeholder="Search location"
        />
        <MapView style={styles.map} region={region}>
          {location && <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />}
        </MapView>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// src/organisms/ProductDetail/ProductDetail.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Share,
  TouchableOpacity,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import Swiper from 'react-native-swiper';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import MapView, { Marker } from 'react-native-maps';
import API from '../../../services/axios';
import { useThemeStore } from '../../../stores/themeStore';
import { getStyles } from './styles';
import { Button } from '../../../Button';
import { ButtonVariant } from '../../../Button/Button.type';

export type ProductDetailProps = {
  title: string;
  description: string;
  price: number;
  images: { url: string }[];
  location: { latitude: number; longitude: number };
  owner: { _id: string; email: string };
  currentUserId: string;
  onDelete?: () => void;
  onEdit?: () => void;
};

export const ProductDetail: React.FC<ProductDetailProps> = ({
  title,
  description,
  price,
  images,
  location,
  owner,
  currentUserId,
  onDelete,
  onEdit,
}) => {
  const { theme } = useThemeStore();
  const styles = getStyles(theme);
  const baseURL = API.defaults.baseURL;

  const resolveUri = (url: string) =>
    url.startsWith('http') ? url : `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;

  const handleShare = async () => {
    try {
      await Share.share({ message: `${title}\n\n${description}` });
    } catch {
      Alert.alert('Error', 'Could not share product');
    }
  };

  const handleSaveImage = async (url: string) => {
    try {
      if (Platform.OS === 'android') {
        const permission = Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot save image without permission.');
          return;
        }
      }

      const fileName = url.split('/').pop();
      const localPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      const response = await API.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary').toString('base64');

      await RNFS.writeFile(localPath, buffer, 'base64');
      await CameraRoll.save(localPath, { type: 'photo' });

      Alert.alert('Success', 'Image saved to gallery!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const isOwner = currentUserId === owner._id;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.swiperContainer}>
        <Swiper loop={false} height={300}>
          {images.length ? (
            images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.9}
                onLongPress={() => handleSaveImage(resolveUri(img.url))}
              >
                <View style={[styles.imageWrapper]}><Image source={{ uri: resolveUri(img.url) }} style={styles.image} /></View></TouchableOpacity>
            ))
          ) : (
            <View style={styles.noImageContainer}>
              <Text>No photos available</Text>
            </View>
          )}
        </Swiper>
        <View style={styles.swiperBorder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        <Text style={styles.description}>{description}</Text>

        {location.latitude && location.longitude ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location} />
          </MapView>
        ) : (
          <View style={styles.noLocationContainer}>
            <Text>Location not available</Text>
          </View>
        )}

        <View style={styles.ownerContainer}>
          <Button
            onPress={() => Linking.openURL(`mailto:${owner.email}`)}
            variant={ButtonVariant.OUTLINE_PRIMARY}
          >
            Message Seller
          </Button>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={handleShare} variant={ButtonVariant.OUTLINE_PRIMARY}>
            Share Listing
          </Button>
          {isOwner && onEdit && (
            <Button onPress={onEdit} variant={ButtonVariant.OUTLINE_PRIMARY}>
              Update Listing
            </Button>
          )}
          <Button onPress={() => {}} variant={ButtonVariant.PRIMARY}>
            Buy Now
          </Button>
          {isOwner && onDelete && (
            <Button onPress={onDelete} variant={ButtonVariant.DANGER}>
              Remove Listing
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

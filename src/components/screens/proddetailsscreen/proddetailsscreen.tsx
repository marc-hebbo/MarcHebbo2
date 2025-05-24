import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import API from '../../../services/axios';
import { ProductDetail, ProductDetailProps } from '../../organisms/ProductDetail/ProductDetail';
import { useAuthStore } from '../../../stores/authStore';
import styles from './styles';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string };
  EditProduct: { productId: string };
};

type DetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

const DEFAULT_OWNER = { _id: '', email: '' };

export const ProductDetailScreen: React.FC = () => {
  const { params } = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const accessToken = useAuthStore(state => state.accessToken);
  const userId = useAuthStore(state => (state as any).userId);
  const [product, setProduct] = useState<ProductDetailProps | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDelete = useCallback(() => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await API.delete(`/api/products/${params.productId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            Alert.alert('Deleted', 'Your product has been removed');
            navigation.goBack();
          } catch (error: any) {
            console.error('[ProductDetailScreen] delete failed:', error);
            Alert.alert(
              'Error',
              error.response?.status === 521
                ? 'Service temporarily unavailable.'
                : 'Could not delete product'
            );
          }
        },
      },
    ]);
  }, [params.productId, accessToken, navigation]);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await API.get(`/api/products/${params.productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const d = response.data.data || response.data;

      setProduct({
        title: d.title,
        description: d.description,
        price: typeof d.price === 'number' ? d.price : 0,
        images: Array.isArray(d.images) ? d.images : [],
        location:
          d.location?.latitude && d.location?.longitude
            ? d.location
            : { latitude: 0, longitude: 0 },
        owner: d.user ? { _id: d.user._id, email: d.user.email } : DEFAULT_OWNER,
        currentUserId: userId || '',
        onDelete: handleDelete,
        onEdit: () => navigation.navigate('EditProduct', { productId: params.productId }),
      });
    } catch (error: any) {
      console.error('[ProductDetailScreen] fetchProduct failed:', error);
      if (error.response?.status === 521) {
        Alert.alert('Error', 'Service temporarily unavailable.');
      } else {
        Alert.alert('Error', 'Failed to load product details');
      }
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [params.productId, accessToken, handleDelete, navigation, userId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!product) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ProductDetail {...product} />
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

import React, { useEffect, useState } from 'react';
import { ProductFormScreen, type FormData as ProductFormData } from '../ProductFormScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Alert, ActivityIndicator, View, Text } from 'react-native';
import axios from '../../../services/axios';

export const EditProductWrapper = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params as { productId: string };

  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}`);
        console.log('Fetched product data:', res.data);
        setProductData(res.data.data);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
        Alert.alert('Error', 'Failed to load product', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    console.log('Fetching product with id:', productId);
    fetchProduct();
  }, [productId, navigation]);

  const handleEditProduct = async (
    data: ProductFormData,
    images: any[],
    location: any
  ) => {
    try {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('location', JSON.stringify(location));

      images.forEach((img, index) => {
        formData.append('images', {
          uri: img.uri,
          name: img.name || `image_${index}.jpg`,
          type: img.type || 'image/jpeg',
        } as any);
      });

      await axios.put(`/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Product updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update product');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !productData) {
    return null;
  }

  const baseURL = axios.defaults.baseURL;

  const initialImages = (productData.images || []).map((img: any) => {
  const url = typeof img === 'string' ? img : img.url || '';
  const fullUrl = url.startsWith('http')
    ? url
    : `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`;

  return {
    uri: fullUrl,     
    name: '',         
    type: 'image/jpeg', 
  };
});

  const initialValues: Partial<ProductFormData> = {
    title: productData.title || '',
    description: productData.description || '',
    price: productData.price || 0,
  };

  const initialLocation = productData.location || null;

  return (
    <ProductFormScreen
      onSubmitHandler={handleEditProduct}
      initialValues={initialValues}
      initialImages={initialImages}
      initialLocation={initialLocation}
      isEditing={true}
      submitButtonLabel="Update Product"
      titleText="Edit Product"
    />
  );
};

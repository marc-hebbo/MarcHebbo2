import type { FC } from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  TextInput,
  View,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import API from '../../../services/axios';
import { useAuthStore } from '../../../stores/authStore';
import { useThemeStore } from '../../../stores/themeStore';
import type { NavigationParams } from '../../../navigation/navigation';
import { Navbar } from '../../../nav';
import { TabBar } from '../../../components/organisms/tabbar';
import { ProductCard } from '../../../components/organisms/ProductCard';
import { getStyles } from './styles';

// Data types
interface ProductData {
  _id: string;
  title: string;
  price: number;
  images: Array<{ url: string }>;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
}

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  styles: any;
}

// Product list hook
const useProductList = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const hasFetchedOnce = useRef(false);
  const accessToken = useAuthStore(s => s.accessToken);
  const refreshAccessToken = useAuthStore(s => s.refreshAccessToken);

  const fetchProducts = useCallback(
    async (pageToFetch = 1, isRefresh = false) => {
      if (!accessToken) return;
      if (!isRefresh) setLoading(true);
      setError(null);

      const params: Record<string, any> = { page: pageToFetch, limit: 10 };
      if (sortOrder) {
        params.sortBy = 'price';
        params.order = sortOrder;
      }

      try {
        const endpoint = searchTerm ? '/api/products/search' : '/api/products';
        const searchParams = searchTerm ? { query: searchTerm } : params;

        const res = await API.get(endpoint, {
          params: searchParams,
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const fetched = res.data.data;
        const pagination = res.data.pagination as PaginationData;

        setProducts(fetched);
        setTotalPages(pagination?.totalPages ?? 1);
        setPage(pagination?.currentPage ?? pageToFetch);
      } catch (e: any) {
        setError(
          e.response?.status === 521
            ? 'Server unavailable, pull to retry'
            : e.message || 'Failed to fetch products'
        );
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [accessToken, searchTerm, sortOrder]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    hasFetchedOnce.current = false;

    const refreshed = await refreshAccessToken();
    if (refreshed) {
      fetchProducts(1, true);
    } else {
      setRefreshing(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(current => (current === 'asc' ? 'desc' : 'asc'));
  };

  return {
    products,
    loading,
    error,
    page,
    totalPages,
    refreshing,
    searchTerm,
    sortOrder,
    hasFetchedOnce,
    setSearchTerm,
    fetchProducts,
    onRefresh,
    toggleSortOrder,
  };
};

// Pagination component
const Pagination: FC<PaginationComponentProps> = ({ currentPage, totalPages, onPageChange, styles }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    if (currentPage <= 2) {
      start = 1;
      end = Math.min(3, totalPages);
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(totalPages - 2, 1);
      end = totalPages;
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        disabled={currentPage <= 1}
        onPress={() => onPageChange(currentPage - 1)}
        style={[styles.paginationButton, currentPage <= 1 && styles.disabledButton]}
      >
        <Text style={styles.paginationText}>Previous</Text>
      </TouchableOpacity>

      {getPageNumbers().map(pn => (
        <TouchableOpacity
          key={pn}
          onPress={() => onPageChange(pn)}
          style={[styles.paginationButton, pn === currentPage && styles.activePage]}
        >
          <Text style={[styles.paginationText, pn === currentPage && styles.activePageText]}>
            {pn}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        disabled={currentPage >= totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        style={[styles.paginationButton, currentPage >= totalPages && styles.disabledButton]}
      >
        <Text style={styles.paginationText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

// Search and filter component
const SearchAndFilter: FC<{
  searchTerm: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit: () => void;
  onSortToggle: () => void;
  theme: 'light' | 'dark';
}> = ({ searchTerm, onSearchChange, onSearchSubmit, onSortToggle, theme }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <View style={{ flex: 1, marginRight: 8 }}>
        <TextInput
          placeholder="Find products..."
          value={searchTerm}
          onChangeText={onSearchChange}
          onSubmitEditing={onSearchSubmit}
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={{
            backgroundColor: theme === 'dark' ? '#333' : '#eee',
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 40,
            color: theme === 'dark' ? 'white' : 'black',
          }}
        />
      </View>

      <TouchableOpacity
        onPress={onSortToggle}
        style={{
          padding: 8,
          backgroundColor: theme === 'dark' ? '#555' : '#ddd',
          borderRadius: 8,
        }}
      >
        <Filter color={theme === 'dark' ? 'white' : 'black'} size={22} />
      </TouchableOpacity>
    </View>
  );
};

// Main component
export const ProductListScreen: FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationParams>>();
  const { theme } = useThemeStore();
  const styles = getStyles(theme === 'dark');
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  const {
    products,
    loading,
    error,
    page,
    totalPages,
    refreshing,
    searchTerm,
    sortOrder,
    hasFetchedOnce,
    setSearchTerm,
    fetchProducts,
    onRefresh,
    toggleSortOrder,
  } = useProductList();

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn && !hasFetchedOnce.current) {
        fetchProducts(1);
        hasFetchedOnce.current = true;
      }
    }, [isLoggedIn, fetchProducts])
  );

  useEffect(() => {
    if (hasFetchedOnce.current) {
      fetchProducts(1);
    }
  }, [sortOrder]);

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />

      <View style={{ flex: 1 }}>
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={() => fetchProducts(1)}
          onSortToggle={toggleSortOrder}
          theme={theme}
        />

        {loading && page === 1 ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={x => x._id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const fullImageUrl = item.images[0]?.url
                ? API.defaults.baseURL + item.images[0].url
                : undefined;

              return (
                <ProductCard
                  title={item.title}
                  price={item.price}
                  imageUrl={fullImageUrl}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
                />
              );
            }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListFooterComponent={
              <>
                {loading && page > 1 && <ActivityIndicator size="small" style={{ margin: 10 }} />}
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={fetchProducts}
                  styles={styles}
                />
              </>
            }
          />
        )}
      </View>

      <TabBar />
    </SafeAreaView>
  );
};

export default ProductListScreen;

import type { FC } from 'react';
import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { LoginScreen } from '../components/screens/login';
import { SignupScreen } from '../components/screens/signup';
import { VerificationScreen } from '../components/screens/verification';
import { ProductListScreen } from '../components/screens/ProductListScreen';
import { ProductDetailScreen } from '../components/screens/proddetailsscreen';
import { ProfileEditScreen } from '../components/screens/editprofile';
import { AddProductWrapper } from '../components/screens/editprodwrapper';
import { EditProductWrapper } from '../components/screens/EditProductWrapper';

// Screen identifiers
const SCREENS = {
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'SignUp',
    VERIFY: 'Verification',
  },
  MAIN: {
    PRODUCTS: 'ProductList',
    PRODUCT_DETAILS: 'ProductDetail',
    PROFILE: 'ProfileEdit',
    ADD_PRODUCT: 'AddProduct',
    EDIT_PRODUCT: 'EditProduct',
  },
} as const;

// Navigation parameter types
type NavigationParams = {
  [SCREENS.AUTH.LOGIN]: undefined;
  [SCREENS.AUTH.REGISTER]: { email: string };
  [SCREENS.AUTH.VERIFY]: { email: string };
  [SCREENS.MAIN.PRODUCTS]: undefined;
  [SCREENS.MAIN.PRODUCT_DETAILS]: { productId: string };
  [SCREENS.MAIN.PROFILE]: undefined;
  [SCREENS.MAIN.ADD_PRODUCT]: undefined;
  [SCREENS.MAIN.EDIT_PRODUCT]: { productId: string };
};

const Stack = createNativeStackNavigator<NavigationParams>();

// Loading indicator component
const LoadingIndicator: FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

// Authentication flow screens
const AuthenticationScreens: FC = () => {
  return (
    <>
      <Stack.Screen name={SCREENS.AUTH.LOGIN} component={LoginScreen} />
      <Stack.Screen name={SCREENS.AUTH.REGISTER} component={SignupScreen} />
    </>
  );
};

// Main application screens
const ApplicationScreens: FC = () => {
  return (
    <>
      <Stack.Screen name={SCREENS.MAIN.PRODUCTS} component={ProductListScreen} />
      <Stack.Screen name={SCREENS.MAIN.PRODUCT_DETAILS} component={ProductDetailScreen} />
      <Stack.Screen name={SCREENS.MAIN.PROFILE} component={ProfileEditScreen} />
      <Stack.Screen name={SCREENS.MAIN.ADD_PRODUCT} component={AddProductWrapper} />
      <Stack.Screen name={SCREENS.MAIN.EDIT_PRODUCT} component={EditProductWrapper} />
    </>
  );
};

// Main navigation component
export const AppNavigator: FC = () => {
  const { isLoggedIn, isVerified, isAuthLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  if (isAuthLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn && <AuthenticationScreens />}
      {isLoggedIn && !isVerified && (
        <Stack.Screen name={SCREENS.AUTH.VERIFY} component={VerificationScreen} />
      )}
      {isLoggedIn && isVerified && <ApplicationScreens />}
    </Stack.Navigator>
  );
};

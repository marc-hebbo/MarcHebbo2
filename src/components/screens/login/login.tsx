import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../../utils/validation/loginSchema';
import { Input } from '../../../Input';
import { Button } from '../../../Button';
import { ButtonVariant } from '../../../Button/Button.type';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import backgroundImage from '../../../../assets/images/background.png';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Animatable from 'react-native-animatable';
import API from '../../../services/axios';
import { useAuthStore } from '../../../stores/authStore';

export type RootStackParamList = {
  Login: undefined;
  SignUp: { email: string };
  Verification: { email: string };
  ProductList: undefined;
  ProductDetail: { productId: string };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const passwordRef = useRef<TextInput>(null);

  const [loading, setLoading] = React.useState(false);  

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { login: authLogin } = useAuthStore();

  


  const onSubmit = async (data: LoginFormData) => {
  if (loading) return;
  setLoading(true);

  try {
    console.log('[LoginScreen] Submitting login for:', data.email);
    const result = await authLogin(data.email, data.password);
    console.log('[LoginScreen] Login result:', result);

    if (result === 'success') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ProductList' }],
      });
      return;
    }

    if (result === 'unverified') {
      console.log('[LoginScreen] Unverified, resending OTP for:', data.email);
      await API.post('/api/auth/resend-verification-otp', { email: data.email });
      Alert.alert('Verification Required', 'We sent you a fresh code.');
      navigation.navigate('Verification', { email: data.email });
      return;
    }

    Alert.alert('Login Failed', 'Invalid email or password.');
  } catch (err: any) {
    console.error('[LoginScreen] Unexpected error during login:', err);
    Alert.alert('Error', 'Something went wrong. Please try again.');
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
              <ScrollView
                contentContainerStyle={styles.innerContainer}
                keyboardShouldPersistTaps="handled"
              >
                <Animatable.View animation="fadeInDown" duration={2000} delay={100}>
                  <Text style={styles.title}>Welcome Back</Text>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" duration={1000} delay={300}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Email Address:"
                        placeholder="Type your email here"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.email?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                      />
                    )}
                  />
                </Animatable.View>

                <Animatable.View animation="fadeInUp" duration={1000} delay={500}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={passwordRef}
                        label="Password:"
                        placeholder="Type your password here"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.password?.message}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
                      />
                    )}
                  />
                </Animatable.View>

                <Animatable.View animation="fadeInUp" duration={1000} delay={700}>
                  <View style={styles.buttonContainer}>
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      onPress={handleSubmit(onSubmit)}
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <TouchableOpacity onPress={() => navigation.navigate('SignUp', { email: '' })}>
                      <Text style={[styles.linkText, { textDecorationLine: 'underline' }]}>
                        New here? Create an account
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

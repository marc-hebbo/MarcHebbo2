import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../Button';
import { styles } from './styles';
import { ButtonVariant } from '../../../Button/Button.type';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import API from '../../../services/axios';
import { useAuthStore } from '../../../stores/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';



type RootStackParamList = {
  Login: undefined;
  SignUp: { email: string };
  Verification: { email: string };
  ProductList: undefined;
  ProductDetail: { productId: string };
};

type VerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Verification'>;
type VerificationScreenRouteProp = RouteProp<RootStackParamList, 'Verification'>;

export const VerificationScreen: React.FC = () => {
  const { verify } = useAuthStore();
    const { isLoggedIn, isVerified } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } else if (isVerified) {
      navigation.reset({ index: 0, routes: [{ name: 'ProductList' }] });
    }
  }, [isLoggedIn, isVerified]);

  const navigation = useNavigation<VerificationScreenNavigationProp>();
  const route = useRoute<VerificationScreenRouteProp>();

const email = useAuthStore(state => state.email) ?? '';
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = Array(6).fill(null).map(() => useRef<TextInput>(null));
  const [isResending, setIsResending] = useState(false);

 const handleVerify = async () => {
  const otpCode = otp.join('');
  if (otpCode.length !== 6) {
    Alert.alert('Enter a 6-digit code');
    return;
  }

  try {
    const response = await API.post('/api/auth/verify-otp', { email, otp: otpCode });

    if (response.data.success) {
      useAuthStore.setState({
        isVerified: true,
        isLoggedIn: false,  
        accessToken: null, 
      });

      Alert.alert(
        'Verified!',
        'Your email has been verified. Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => {
            },
          },
        ]
      );
    } else {
      Alert.alert('Verification failed', response.data.error?.message || 'Invalid code');
    }
  } catch (error: any) {
    Alert.alert('Verification error', error.response?.data?.message || error.message || 'An error occurred');
  }
};


  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      handleVerify();
    }
  }, [otp]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];

    if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) inputRefs[index - 1].current?.focus();
      return;
    }

    if (!/^\d$/.test(text)) return;

    newOtp[index] = text;
    setOtp(newOtp);

    if (index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs[index - 1].current?.focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>A 6-digit code has been sent to: {email}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                autoFocus={index === 0}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              />
            ))}
          </View>

          <Button onPress={handleVerify} variant={ButtonVariant.PRIMARY}>
            Confirm Code
          </Button>
         
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

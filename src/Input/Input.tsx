import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { InputProps } from './Input.type';
import { Eye, EyeOff } from 'lucide-react-native';

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, style, secureTextEntry, ...rest }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const showEye = typeof secureTextEntry !== 'undefined';

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputWrapper}>
        <TextInput
          ref={ref}
          style={[styles.input, style, error && styles.inputError]}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onSubmitEditing={rest.onSubmitEditing}
          returnKeyType={rest.returnKeyType}     
          {...rest}
        />

          {showEye && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible((prev) => !prev)}
            >
              {isPasswordVisible ? (
                <EyeOff size={20} color="#777" /> 
              ) : (
                <Eye size={20} color="#777" /> 
              )}
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);


const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    fontFamily: 'Montserrat-Black',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontFamily: 'Montserrat-Black',
    paddingRight: 40, 
  },
  inputError: {
    borderColor: 'red',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
    fontFamily: 'Montserrat-Black',
  },
});

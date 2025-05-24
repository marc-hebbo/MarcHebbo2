import React, { FC } from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { ButtonProps, ButtonVariant } from './Button.type';

const getVariantStyle = (variant?: ButtonVariant): ViewStyle => {
  switch (variant) {
    case ButtonVariant.PRIMARY:
      return { backgroundColor: '#007bff' };
    case ButtonVariant.OUTLINE_PRIMARY:
      return {
        borderWidth: 1,
        borderColor: '#007bff',
        backgroundColor: 'transparent',
      };
    case ButtonVariant.DANGER:
      return { backgroundColor: '#dc3545' };
    default:
      return {}; 
  }
};

export const Button: FC<ButtonProps> = ({
  onPress,
  children,
  variant = ButtonVariant.PRIMARY,
  disabled = false,
  loading = false,
  style,
}) => {
  const variantStyle = getVariantStyle(variant);

  return (
    <TouchableOpacity
      onPress={!disabled && !loading ? onPress : undefined}
      style={[
        styles.base,
        variantStyle,
        disabled && styles.disabled,
        loading && styles.loading,
        style,
      ]}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === ButtonVariant.PRIMARY ? '#fff' : '#000'} />
      ) : (
        <Text style={[styles.text, variant === ButtonVariant.OUTLINE_PRIMARY && styles.outlineText]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Montserrat-Black',
    fontSize: 20,
  },
  outlineText: {
    color: '#007bff',
    fontFamily: 'Montserrat-Black', 
  },
  loading: {
    // Add appropriate styles for loading state
  },
});

export default Button;

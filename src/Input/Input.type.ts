import { TextInputProps, TextInput } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: object;
}

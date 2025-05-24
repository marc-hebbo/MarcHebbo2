export enum ButtonVariant {
    PRIMARY = 'primary',
    OUTLINE_PRIMARY = 'outline-primary',
    DANGER = 'danger',
    SECONDARY = 'secondary',
  }
  
  import { GestureResponderEvent } from 'react-native';
  
  export interface ButtonProps {
    onPress?: (event: GestureResponderEvent) => void;
    children: React.ReactNode;
    variant?: ButtonVariant;
    disabled?: boolean;
    style?: object;
    
  }
  
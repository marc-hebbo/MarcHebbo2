export const fonts = {
  regular: 'Montserrat-Regular',
  medium: 'Montserrat-Medium',
  semiBold: 'Montserrat-SemiBold',
  bold: 'Montserrat-Bold',
  light: 'Montserrat-Light',
  thin: 'Montserrat-Thin',
  black: 'Montserrat-Black',
  extraBold: 'Montserrat-ExtraBold',
  extraLight: 'Montserrat-ExtraLight',
} as const;

export type FontFamily = keyof typeof fonts; 
import { fonts } from './fonts';

export const theme = {
  fonts,
  typography: {
    h1: {
      fontFamily: fonts.bold,
      fontSize: 32,
    },
    h2: {
      fontFamily: fonts.semiBold,
      fontSize: 24,
    },
    h3: {
      fontFamily: fonts.medium,
      fontSize: 20,
    },
    body: {
      fontFamily: fonts.regular,
      fontSize: 16,
    },
    caption: {
      fontFamily: fonts.light,
      fontSize: 14,
    },
  },
} as const;

export type Theme = typeof theme; 
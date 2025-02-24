export const theme = {
    colors: {
      primary: '#6366F1',
      secondary: '#EC4899',
      
      background: '#FFFFFF',
      surface: '#F4F4F5',

      text: {
        primary: '#18181B',
        secondary: '#71717A',
      },
      
      success: '#22C55E',
      
      timer: {
        running: '#4CAF50',
        paused: '#FFC107',
        completed: '#22C55E',
      }
    },
  
    typography: {
      fonts: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },

      sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        'extra': 64,
      },

      lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
  
    spacing: {
      none: 0,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 40,
      '3xl': 48,
    },
  
    borders: {
      radius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        'extra': 20
      },

      width: {
        none: 0,
        thin: 1,
        thick: 2,
      },
      
    },
  };
  
export type Theme = typeof theme;
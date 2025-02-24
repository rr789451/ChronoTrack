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
        running: '#22C55E',
        paused: '#F59E0B',
        completed: '#6366F1',
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
      },

      width: {
        none: 0,
        thin: 1,
        thick: 2,
      },
      
    },
  
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 5,
      },
    },
  };
  
export type Theme = typeof theme;
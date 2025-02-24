import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.95;

export const timerStyles = StyleSheet.create({
  timerCard: {
    width: cardWidth,
    backgroundColor: theme.colors.text.primary,
    borderRadius: theme.borders.radius.extra,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
    overflow: 'hidden',
  },

  leftContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: theme.spacing.sm,
  },

  timerName: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.xs,
  },
  
  timerDigits: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.extra,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  resetButton: {
    backgroundColor: '#333333',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 9999,
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
  },

  resetButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },

  rightContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#0B4357',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  controlButton: {
    width: 80,
    height: 80,
    backgroundColor: '#000000',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 18,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: 'white',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginLeft: theme.spacing.xs,
  },

  pauseIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  pauseBar: {
    width: 6,
    height: 24,
    backgroundColor: 'white',
    borderRadius: theme.borders.radius.sm,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },

  completedText: {
    color: theme.colors.success,
    fontWeight: '700',
    fontSize: theme.typography.sizes.sm,
  },

  disabledButton: {
    opacity: 0.5,
  },
  
  disabledIcon: {
    opacity: 0.5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  congratsText: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: 'bold',
    color: theme.colors.success,
    marginBottom: theme.spacing.md,
  },

  timerNameText: {
    fontSize: theme.typography.sizes.lg,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },

  highlightText: {
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },

  closeButton: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borders.radius.md,
  },

  closeButtonText: {
    color: 'white',
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
  },

  runningText: {
    color: theme.colors.timer.paused, 
    fontWeight: '700',
    fontSize: theme.typography.sizes.sm,
  },
  
  pausedText: {
    color: theme.colors.timer.paused, 
    fontWeight: '700',
    fontSize: theme.typography.sizes.sm,
  },

  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#0B4357',
    borderRadius: theme.spacing.xs,
  },

  percentageText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: '#555',
    width: theme.spacing['2xl'],
    textAlign: 'right',
  }
});
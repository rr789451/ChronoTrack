import { StyleSheet } from 'react-native';
import { theme } from '../theme/index';

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
      },

      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
      },

      headerTitle: {
        fontSize: theme.typography.sizes['3xl'],
        marginTop: theme.spacing.md,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
      },

      addButton: {
        width: 40,
        height: 40,
        marginTop: theme.spacing.md,
        borderRadius: theme.borders.radius.extra,
        backgroundColor: theme.colors.text.primary,
        justifyContent: 'center',
        alignItems: 'center',
      },

      listContent: {
        paddingBottom: theme.spacing.md,
      },

      sectionHeader: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: theme.borders.width.thin,
        borderBottomColor: '#e1e4e8',
      },

      sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      expandButton: {
        marginRight: theme.spacing.sm,
      },

      sectionTitle: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: '600',
        color: theme.colors.text.primary,
        flex: 1,
      },

      timerCount: {
        fontSize: theme.typography.sizes.sm,
        color: '#666',
      },

      bulkActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: theme.spacing.sm,
      },

      bulkActionButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: theme.borders.radius.extra,
        marginRight: theme.spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },

      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing['2xl'],
      },

      emptyTitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: 'bold',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        color: '#333',
      },

      emptyText: {
        fontSize: theme.typography.sizes.md,
        textAlign: 'center',
        color: '#666',
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
        color: '#4CAF50',
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
        color: '#0B4357',
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

    createButton: {
        backgroundColor: '#333',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
    },
    
    createButtonText: {
        color: '#fff',
        fontSize: theme.typography.sizes.md,
        fontWeight: '600',
    },
});
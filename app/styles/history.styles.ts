
import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: theme.borders.width.thin,
    borderBottomColor: '#e1e4e8',
    backgroundColor: '#fff',
  },

  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
    color: '#0B4357',
  },

  clearButton: {
    padding: theme.spacing.sm,
  },

  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing['2xl'],
    flexGrow: 1,
  },

  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  historyDetails: {
    flex: 1,
  },

  historyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: '#333',
    marginBottom: theme.spacing.xs,
  },

  historyCategory: {
    fontSize: theme.typography.sizes.sm,
    color: '#666',
    backgroundColor: '#f1f2f6',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },

  historyTime: {
    fontSize: theme.typography.sizes.sm,
    color: '#333',
    marginBottom: theme.spacing.xs,
  },

  historyDate: {
    fontSize: theme.typography.sizes.sm,
    color: '#666',
  },

  checkmarkContainer: {
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
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

  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
})
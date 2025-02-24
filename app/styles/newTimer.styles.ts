import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

export const newTimerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  keyboardAvoidView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing['2xl'],
  },

  headerTitle: {
    fontSize: theme.typography.sizes['3xl'],
    margin: theme.spacing.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },

  form: {
    padding: theme.spacing.md,
  },

  formGroup: {
    marginBottom: theme.spacing.lg,
  },

  label: {
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },

  input: {
    height: 50,
    borderWidth: theme.borders.width.thin,
    borderColor: '#ced4da',
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    backgroundColor: '#fff',
  },

  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  durationInput: {
    flex: 1,
  },

  timeInput: {
    height: 50,
    borderWidth: theme.borders.width.thin,
    borderColor: '#ced4da',
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    backgroundColor: '#fff',
  },

  categorySelect: {
    height: 50,
    borderWidth: theme.borders.width.thin,
    borderColor: '#ced4da',
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoryText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },

  placeholder: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },

  helperText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },

  createButton: {
    backgroundColor: theme.colors.text.primary,
    borderRadius: theme.borders.radius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },

  createButtonText: {
    color: '#fff',
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: theme.borders.radius.xl,
    borderTopRightRadius: theme.borders.radius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing['2xl'],
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: theme.borders.width.thin,
    borderBottomColor: theme.colors.text.secondary,
  },

  modalTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },

  addCategoryContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  addCategoryInput: {
    flex: 1,
    height: 50,
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.text.secondary,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    backgroundColor: '#fff',
    marginRight: theme.spacing.sm,
  },

  addCategoryButton: {
    backgroundColor: theme.colors.text.primary,
    borderRadius: theme.spacing.sm,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryButtonText: {
    color: '#fff',
    fontSize: theme.typography.sizes.md,
    fontWeight: '600',
  },

  categoriesList: {
    marginTop: theme.spacing.md,
    maxHeight: 300,
  },

  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: theme.borders.width.thin,
    borderBottomColor: theme.colors.text.secondary,
  },

  categoryItemText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },

  noCategoriesText: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
  },
});
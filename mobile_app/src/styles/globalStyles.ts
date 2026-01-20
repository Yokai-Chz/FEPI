import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZE } from '../../constants/theme';

export const globalStyles = StyleSheet.create({
  // --- LAYOUT ---
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary, // Header suele ser de este color
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // --- TARJETAS ---
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.md,
    marginBottom: SPACING.md,
  },
  
  // --- TYPOGRAPHY ---
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSec,
    fontWeight: 'bold',
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  
  // --- INPUTS ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md, // Ajustable según OS
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textMain,
    fontWeight: 'bold',
  },

  // --- BOTONES ---
  btnPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  btnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: FONT_SIZE.sm,
  },
});

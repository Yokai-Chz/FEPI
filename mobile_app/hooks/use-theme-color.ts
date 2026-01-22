/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  // Mapping logic
  if (colorName === 'text') return COLORS.textMain;
  if (colorName === 'background') return COLORS.background;
  if (colorName === 'icon') return COLORS.primary;

  return COLORS.textMain;
}

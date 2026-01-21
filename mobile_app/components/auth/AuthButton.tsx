import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SHADOWS } from '../../constants/theme';

interface AuthButtonProps {
  onPress: () => void;
  text: string;
  isLoading?: boolean;
}

export default function AuthButton({ onPress, text, isLoading = false }: AuthButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, isLoading && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { 
    backgroundColor: COLORS.primary, 
    paddingVertical: 18, 
    borderRadius: BORDER_RADIUS.xl, 
    alignItems: 'center', 
    marginTop: 8,
    ...SHADOWS.md
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    letterSpacing: 2, 
    fontSize: FONT_SIZE.sm 
  },
});

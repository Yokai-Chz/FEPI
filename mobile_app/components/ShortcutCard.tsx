import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ShortcutCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function ShortcutCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  onPress, 
  disabled = false 
}: ShortcutCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.shortcutCard, disabled && styles.disabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.iconSmall, { backgroundColor: iconBgColor }]}>
        <Icon size={16} color={iconColor} />
      </View>
      <View>
        <Text style={styles.shortcutMain}>{title}</Text>
        <Text style={styles.shortcutSub}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shortcutCard: { 
    width: '48%', 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    elevation: 1, 
    borderWidth: 1, 
    borderColor: '#f3f4f6' 
  },
  disabled: {
    opacity: 0.6
  },
  iconSmall: { 
    width: 32, 
    height: 32, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  shortcutMain: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: '#1f2937' 
  },
  shortcutSub: { 
    fontSize: 8, 
    color: '#9ca3af', 
    fontWeight: 'bold', 
    marginTop: 2 
  }
});

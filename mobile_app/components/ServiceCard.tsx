import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ServiceCardProps {
  label: string;
  icon: LucideIcon;
  bgColor: string;
  onPress: () => void;
}

export default function ServiceCard({ label, icon: Icon, bgColor, onPress }: ServiceCardProps) {
  return (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
      <View style={[styles.iconLarge, { backgroundColor: bgColor }]}>
        <Icon size={20} color="white" />
      </View>
      <Text style={styles.serviceLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  serviceCard: { 
    width: '30%', 
    backgroundColor: 'white', 
    borderRadius: 24, 
    padding: 16, 
    alignItems: 'center', 
    gap: 12, 
    elevation: 2, 
    borderWidth: 1, 
    borderColor: '#f3f4f6' 
  },
  iconLarge: { 
    width: 48, 
    height: 48, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 3 
  },
  serviceLabel: { 
    fontSize: 9, 
    fontWeight: '900', 
    color: '#4b5563', 
    textAlign: 'center' 
  },
});

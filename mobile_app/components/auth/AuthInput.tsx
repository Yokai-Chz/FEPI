import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  iconSource: ImageSourcePropType;
  isPassword?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  iconSource,
  isPassword = false,
  autoCapitalize = 'sentences'
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Image 
          source={iconSource} 
          style={styles.inputIcon} 
        />
        <TextInput 
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={isPassword && !showPassword}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image 
              source={require('../../assets/images/icon_ojo.png')} 
              style={styles.eyeIcon} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: { marginBottom: SPACING.lg },
  label: { 
    color: COLORS.primary, 
    fontSize: FONT_SIZE.xs, 
    fontWeight: '900', 
    letterSpacing: 1, 
    marginBottom: SPACING.sm 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#f3f4f6', 
    borderRadius: BORDER_RADIUS.lg, 
    paddingHorizontal: SPACING.md, 
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm 
  },
  inputIcon: { 
    width: 24, 
    height: 24, 
    opacity: 0.4, 
    marginRight: SPACING.md 
  },
  input: { 
    flex: 1, 
    color: COLORS.textMain, 
    fontWeight: 'bold', 
    fontSize: FONT_SIZE.lg 
  },
  eyeIcon: { 
    width: 24, 
    height: 24, 
    opacity: 0.4 
  },
});

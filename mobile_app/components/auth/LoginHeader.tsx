import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../../constants/theme';

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function LoginHeader({
  title = "SSC",
  subtitle = "CONTROL DE TRÁNSITO"
}: LoginHeaderProps) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.iconBox}>
            <Image 
              source={require('../../assets/images/logo_gobierno.png')} 
              style={styles.logoIcon} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.logoText}>GOBIERNO CDMX</Text>
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.iconBox}>
            <Image 
              source={require('../../assets/images/logo_ssc.png')} 
              style={styles.logoIcon} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.logoText}>SECRETARÍA DE{"\n"}SEGURIDAD CIUDADANA</Text>
        </View>
      </View>

      <View style={styles.centerTitleContainer}>
        <Text style={styles.mainTitle}>{title}</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: { 
    padding: SPACING.lg, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  logoContainer: { alignItems: 'center' },
  iconBox: { 
    width: 48, 
    height: 48, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: SPACING.xs 
  },
  logoIcon: { width: 40, height: 40 },
  logoText: { 
    color: 'white', 
    fontSize: 9, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  centerTitleContainer: { 
    alignItems: 'center', 
    marginTop: SPACING.md, 
    marginBottom: 40 
  },
  mainTitle: { 
    color: 'white', 
    fontSize: 36, 
    fontWeight: 'bold', 
    letterSpacing: 8 
  },
  subTitle: { 
    color: 'white', 
    opacity: 0.8, 
    fontSize: FONT_SIZE.xs, 
    letterSpacing: 2, 
    marginTop: SPACING.xs 
  },
});

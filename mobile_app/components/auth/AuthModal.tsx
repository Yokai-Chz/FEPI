import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING } from '../../constants/theme';

interface AuthModalProps {
  visible: boolean;
  onAction: () => void;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'error';
  actionText?: string;
}

export default function AuthModal({ 
  visible, 
  onAction, 
  title, 
  message, 
  type = 'warning',
  actionText = 'CONTINUAR'
}: AuthModalProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      default: return '!';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return COLORS.success;
      case 'error': return COLORS.error;
      default: return COLORS.warning;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
             <Text style={styles.iconText}>{getIcon()}</Text>
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>
            {message}
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={onAction}
          >
            <Text style={styles.modalButtonText}>{actionText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.xl,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  iconText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';

interface ReaderSettingsModalProps {
  visible: boolean;
  fontSizeMultiplier: number;
  onFontSizeChange: (multiplier: number) => void;
  onClose: () => void;
}

export const ReaderSettingsModal: React.FC<ReaderSettingsModalProps> = ({
  visible,
  fontSizeMultiplier,
  onFontSizeChange,
  onClose,
}) => {
  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      },
      content: {
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: tokens.text.secondary,
        marginTop: 16,
        marginBottom: 10,
      },
      sizeBtnRow: {
        flexDirection: 'row',
        gap: 10,
      },
      sizeBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      activeSizeBtn: {
        backgroundColor: tokens.brand.primary,
        borderColor: tokens.brand.primary,
      },
      sizeBtnText: {
        fontSize: 14,
        color: tokens.text.primary,
        fontWeight: '500',
      },
      activeSizeBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      previewCard: {
        backgroundColor: tokens.surface.elevated,
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
      },
      previewLabel: {
        fontSize: 11,
        color: tokens.text.tertiary,
        marginBottom: 4,
      },
      previewText: {
        color: tokens.text.primary,
        lineHeight: 22 * fontSizeMultiplier,
        fontSize: 15 * fontSizeMultiplier,
      },
    })
  );

  const fontSizes = [
    { label: 'ছোট', multiplier: 0.9 },
    { label: 'স্বাভাবিক', multiplier: 1.0 },
    { label: 'বড়', multiplier: 1.15 },
    { label: 'অনেক বড়', multiplier: 1.3 },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>পড়ার সুবিধা ও সেটিংস</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>লেখার আকার (Font Size)</Text>
          <View style={styles.sizeBtnRow}>
            {fontSizes.map((item) => {
              const isActive = Math.abs(fontSizeMultiplier - item.multiplier) < 0.05;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.sizeBtn, isActive && styles.activeSizeBtn]}
                  onPress={() => onFontSizeChange(item.multiplier)}
                >
                  <Text
                    style={[
                      styles.sizeBtnText,
                      isActive && styles.activeSizeBtnText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Live Preview */}
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>প্রিভিউ:</Text>
            <Text style={styles.previewText}>
              দৈনিক আমার দেশ — সত্য প্রকাশে আপসহীন ও স্বাধীনতার কথা বলে।
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

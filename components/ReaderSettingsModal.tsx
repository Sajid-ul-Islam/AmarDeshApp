import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../theme';
import { useAppStore } from '../store/useAppStore';

interface ReaderSettingsModalProps {
  visible: boolean;
  fontSizeMultiplier: number;
  onFontSizeChange: (multiplier: number) => void;
  onClose: () => void;
  onOpenFocusMode?: () => void;
  onOpenQuoteModal?: () => void;
  onOpenAiAssistant?: () => void;
}

export const ReaderSettingsModal: React.FC<ReaderSettingsModalProps> = ({
  visible,
  fontSizeMultiplier,
  onFontSizeChange,
  onClose,
  onOpenFocusMode,
  onOpenQuoteModal,
  onOpenAiAssistant,
}) => {
  const tokens = useThemeTokens();
  const { themePreference, setThemePreference } = useAppStore();
  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      },
      content: {
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: tokens.radii['2xl'],
        borderTopRightRadius: tokens.radii['2xl'],
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.lg,
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      closeIconButton: {
        width: 32,
        height: 32,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
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
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
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
      toolsRow: {
        flexDirection: 'row',
        gap: 10,
      },
      toolBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      toolBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      previewCard: {
        backgroundColor: tokens.surface.elevated,
        padding: 14,
        borderRadius: tokens.radii.lg,
        marginTop: 16,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
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
            <TouchableOpacity style={styles.closeIconButton} onPress={onClose} accessibilityLabel="বন্ধ করুন">
              <Ionicons name="close" size={20} color={tokens.text.secondary} />
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

          {/* Theme Mode Selector */}
          <Text style={styles.sectionTitle}>রিডিং থিম (Reading Theme)</Text>
          <View style={styles.sizeBtnRow}>
            {[
              { label: '☀️ লাইট', value: 'light' as const },
              { label: '📜 সেপিয়া', value: 'sepia' as const },
              { label: '🌙 ডার্ক', value: 'dark' as const },
            ].map((themeOpt) => {
              const isSelected = themePreference === themeOpt.value;
              return (
                <TouchableOpacity
                  key={themeOpt.value}
                  style={[styles.sizeBtn, isSelected && styles.activeSizeBtn]}
                  onPress={() => setThemePreference(themeOpt.value)}
                >
                  <Text
                    style={[
                      styles.sizeBtnText,
                      isSelected && styles.activeSizeBtnText,
                    ]}
                  >
                    {themeOpt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Editorial Tools */}
          {(onOpenFocusMode || onOpenQuoteModal || onOpenAiAssistant) && (
            <>
              <Text style={styles.sectionTitle}>বিশেষ রিডিং সুবিধা</Text>
              <View style={styles.toolsRow}>
                {onOpenFocusMode && (
                  <TouchableOpacity
                    style={styles.toolBtn}
                    onPress={() => {
                      onClose();
                      onOpenFocusMode();
                    }}
                    accessibilityLabel="ফোকাস রিডিং মোড"
                  >
                    <Ionicons name="scan-outline" size={16} color={tokens.brand.primary} />
                    <Text style={styles.toolBtnText}>ফোকাস মোড</Text>
                  </TouchableOpacity>
                )}
                {onOpenQuoteModal && (
                  <TouchableOpacity
                    style={styles.toolBtn}
                    onPress={() => {
                      onClose();
                      onOpenQuoteModal();
                    }}
                    accessibilityLabel="উদ্ধৃতি কার্ড তৈরি করুন"
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={tokens.brand.primary} />
                    <Text style={styles.toolBtnText}>উদ্ধৃতি কার্ড</Text>
                  </TouchableOpacity>
                )}
                {onOpenAiAssistant && (
                  <TouchableOpacity
                    style={styles.toolBtn}
                    onPress={() => {
                      onClose();
                      onOpenAiAssistant();
                    }}
                    accessibilityLabel="স্মার্ট AI সহকারী"
                  >
                    <Ionicons name="sparkles" size={16} color={tokens.brand.heritageGreen} />
                    <Text style={styles.toolBtnText}>AI সহকারী</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

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

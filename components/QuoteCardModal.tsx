import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemedStyles, useThemeTokens, getThemeTokens, ThemeMode } from '../theme';
import { AmarDeshLogo } from './AmarDeshLogo';

interface QuoteCardModalProps {
  visible: boolean;
  articleTitle: string;
  articleUrl?: string;
  authorName?: string;
  initialQuote?: string;
  onClose: () => void;
}

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({
  visible,
  articleTitle,
  articleUrl = 'https://dailyamardesh.com',
  authorName = 'আমার দেশ বিশেষ প্রতিবেদন',
  initialQuote,
  onClose,
}) => {
  const currentTokens = useThemeTokens();
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('light');
  const [copied, setCopied] = useState(false);

  // Fallback quote text if not passed
  const quoteText =
    initialQuote ||
    `“গণতন্ত্র ও সংবাদমাধ্যমের স্বাধীনতা একে অপরের পরিপূরক, একটি ছাড়া অন্যটি বাঁচে না।”`;

  const cardTokens = getThemeTokens(selectedTheme);

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `${quoteText}\n\n— ${authorName} (${articleTitle})\nদৈনিক আমার দেশ: ${articleUrl}`,
        title: 'দৈনিক আমার দেশ - উদ্ধৃতি কার্ড',
      });
    } catch (e) {
      console.error('Error sharing quote:', e);
    }
  };

  const handleCopy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Clipboard.setString(
      `${quoteText}\n\n— ${authorName}\nসূত্র: দৈনিক আমার দেশ (${articleUrl})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
      },
      content: {
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: tokens.radii['2xl'],
        borderTopRightRadius: tokens.radii['2xl'],
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 36,
        maxHeight: '90%',
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
      closeButton: {
        width: 32,
        height: 32,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
      },
      themeSelectorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 14,
      },
      themePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
      },
      activeThemePill: {
        borderColor: tokens.brand.primary,
        backgroundColor: tokens.brand.primary,
      },
      themePillText: {
        fontSize: 13,
        fontWeight: '600',
        color: tokens.text.primary,
      },
      activeThemePillText: {
        color: '#FFFFFF',
      },
      cardWrapper: {
        marginVertical: 10,
        borderRadius: tokens.radii.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: cardTokens.border.default,
        backgroundColor: cardTokens.surface.base,
        padding: 22,
        ...tokens.shadows.card,
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: cardTokens.border.subtle,
        paddingBottom: 12,
        marginBottom: 16,
      },
      watermarkTag: {
        fontSize: 11,
        color: cardTokens.brand.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      quoteMark: {
        fontSize: 36,
        lineHeight: 40,
        color: cardTokens.brand.primary,
        fontFamily: 'serif',
      },
      quoteBody: {
        fontSize: 18,
        lineHeight: 28,
        color: cardTokens.text.primary,
        fontFamily: 'serif',
        fontStyle: 'italic',
        marginVertical: 8,
      },
      cardFooter: {
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 0.5,
        borderTopColor: cardTokens.border.subtle,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      authorText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: cardTokens.text.primary,
      },
      sourceText: {
        fontSize: 11,
        color: cardTokens.text.secondary,
        marginTop: 2,
        maxWidth: 200,
      },
      brandUrlBadge: {
        backgroundColor: cardTokens.brand.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: tokens.radii.sm,
      },
      brandUrlText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      actionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
      },
      actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
        ...tokens.shadows.sm,
      },
      actionBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
      },
      secondaryBtn: {
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      secondaryBtnText: {
        color: tokens.text.primary,
      },
    })
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>সোশ্যাল উদ্ধৃতি কার্ড (Quote Card)</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="বন্ধ করুন"
            >
              <Ionicons name="close" size={20} color={currentTokens.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Theme switcher for quote card */}
            <View style={styles.themeSelectorRow}>
              {[
                { label: '☀️ লাইট', value: 'light' as const },
                { label: '📜 সেপিয়া', value: 'sepia' as const },
                { label: '🌙 ডার্ক', value: 'dark' as const },
              ].map((item) => {
                const isActive = selectedTheme === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.themePill, isActive && styles.activeThemePill]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedTheme(item.value);
                    }}
                  >
                    <Text
                      style={[
                        styles.themePillText,
                        isActive && styles.activeThemePillText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Branded Card Preview */}
            <View style={styles.cardWrapper}>
              <View style={styles.cardHeader}>
                <AmarDeshLogo variant="png" height={22} />
                <Text style={styles.watermarkTag}>« স্বাধীনতার কথা বলে »</Text>
              </View>

              <Text style={styles.quoteMark}>“</Text>
              <Text style={styles.quoteBody}>{quoteText}</Text>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.authorText}>— {authorName}</Text>
                  <Text style={styles.sourceText} numberOfLines={1}>
                    {articleTitle}
                  </Text>
                </View>
                <View style={styles.brandUrlBadge}>
                  <Text style={styles.brandUrlText}>dailyamardesh.com</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.secondaryBtn]}
                onPress={handleCopy}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={18}
                  color={copied ? currentTokens.status.success : currentTokens.text.primary}
                />
                <Text style={[styles.actionBtnText, styles.secondaryBtnText]}>
                  {copied ? 'কপি হয়েছে!' : 'কপি করুন'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>কার্ড শেয়ার করুন</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

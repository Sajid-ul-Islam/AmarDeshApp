import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../theme';
import { Article } from '../data/mockData';
import {
  askArticleAiQuestion,
  getByokAiConfig,
  PROVIDER_METADATA,
} from '../services/byokAiService';

interface AiAssistantModalProps {
  visible: boolean;
  article: Article;
  onClose: () => void;
  onOpenSettings: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

const SUGGESTED_QUESTIONS = [
  'এই ঘটনার মূল পটভূমি কী?',
  'এর ফলে অর্থনীতি বা রাজনীতিতে কী প্রভাব পড়বে?',
  'সাধারণ মানুষের বোঝার সুবিধার্থে সহজ ভাষায় বলুন',
  'এই বিষয়ের সাথে সম্পর্কিত ঐতিহাসিক প্রেক্ষাপট কী?',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  visible,
  article,
  onClose,
  onOpenSettings,
}) => {
  const tokens = useThemeTokens();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `আসসালামু আলাইকুম! আমি দৈনিক আমার দেশ-এর এআই সংবাদ সহকারী। "${article.title.slice(0, 45)}..." প্রতিবেদনটি নিয়ে আপনার কোনো প্রশ্ন বা বিশদ জানার থাকলে নির্দ্বিধায় আমাকে জিজ্ঞাসা করুন।`,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [activeProvider, setActiveProvider] = useState<string>('gemini');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      getByokAiConfig().then((cfg) => {
        setHasApiKey(!!(cfg.apiKey && cfg.apiKey.trim().length >= 8));
        setActiveProvider(cfg.provider);
      });
    }
  }, [visible]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || inputText).trim();
    if (!textToSend || loading) return;

    Keyboard.dismiss();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await askArticleAiQuestion(article, textToSend, chatHistory);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: res.answer,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (_err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          text: 'দুঃখিত, কোনো একটি ত্রুটির কারণে উত্তর দেওয়া সম্ভব হয়নি। অনুগ্রহ করে আপনার নেটওয়ার্ক বা এপিআই কি যাচাই করুন।',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      },
      sheetContainer: {
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: tokens.radii['2xl'],
        borderTopRightRadius: tokens.radii['2xl'],
        height: '85%',
        maxHeight: '92%',
        minHeight: '65%',
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.lg,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      iconButton: {
        width: 32,
        height: 32,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
      },
      messageScroll: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      suggestedContainer: {
        marginBottom: 12,
      },
      suggestedLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: tokens.text.secondary,
        marginBottom: 8,
      },
      suggestedRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
      },
      suggestedChip: {
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      suggestedChipText: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: '500',
      },
      msgBubble: {
        maxWidth: '92%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: tokens.radii.lg,
        marginBottom: 10,
      },
      userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: tokens.brand.primary,
        borderBottomRightRadius: tokens.radii.xs,
      },
      aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: tokens.surface.elevated,
        borderBottomLeftRadius: tokens.radii.xs,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      userMsgText: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
      },
      aiMsgText: {
        color: tokens.text.primary,
        fontSize: 14.5,
        lineHeight: 22,
      },
      inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderTopColor: tokens.border.subtle,
        backgroundColor: tokens.surface.base,
        gap: 8,
      },
      input: {
        flex: 1,
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.pill,
        paddingHorizontal: 16,
        paddingVertical: 9,
        fontSize: 14,
        color: tokens.text.primary,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
      },
      sendBtn: {
        width: 38,
        height: 38,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...tokens.shadows.sm,
      },
      byokBanner: {
        backgroundColor: tokens.brand.surface,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
        borderRadius: tokens.radii.lg,
        padding: 12,
        marginBottom: 14,
        ...tokens.shadows.sm,
      },
      byokBannerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
      },
      byokBannerTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      byokBannerText: {
        fontSize: 12,
        color: tokens.text.secondary,
        lineHeight: 16,
        marginBottom: 10,
      },
      byokBannerBtnRow: {
        flexDirection: 'row',
        gap: 8,
      },
      byokGetBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.brand.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: tokens.radii.pill,
        gap: 4,
      },
      byokGetBtnText: {
        fontSize: 11.5,
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      byokSettingsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.surface.base,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: tokens.radii.pill,
        gap: 4,
      },
      byokSettingsBtnText: {
        fontSize: 11.5,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
    })
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="sparkles" size={18} color={tokens.brand.primary} />
              <Text style={styles.headerTitle}>আমার দেশ এআই সহকারী</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  onClose();
                  onOpenSettings();
                }}
              >
                <Ionicons name="settings-outline" size={18} color={tokens.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={onClose}>
                <Ionicons name="close" size={20} color={tokens.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messageScroll}
            contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={true}
          >
            {/* Banner to directly collect API key or open settings if not configured */}
            {!hasApiKey && (
              <View style={styles.byokBanner}>
                <View style={styles.byokBannerHeader}>
                  <Ionicons name="key" size={16} color={tokens.brand.primary} />
                  <Text style={styles.byokBannerTitle}>AI সহকারী সক্রিয় করুন</Text>
                </View>
                <Text style={styles.byokBannerText}>
                  গুগল এআই স্টুডিও থেকে বিনামূল্যে API কি সংগ্রহ করে আনলিমিটেড প্রশ্নোত্তরের সুবিধা উপভোগ করুন।
                </Text>
                <View style={styles.byokBannerBtnRow}>
                  <TouchableOpacity
                    style={styles.byokGetBtn}
                    onPress={() => {
                      const url =
                        PROVIDER_METADATA[activeProvider as keyof typeof PROVIDER_METADATA]?.keyHelpUrl ||
                        'https://aistudio.google.com/app/apikey';
                      Linking.openURL(url);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="open-outline" size={13} color="#FFFFFF" />
                    <Text style={styles.byokGetBtnText}>ফ্রি Key নিন ↗</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.byokSettingsBtn}
                    onPress={() => {
                      onClose();
                      onOpenSettings();
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="settings-outline" size={13} color={tokens.brand.primary} />
                    <Text style={styles.byokSettingsBtnText}>কি যোগ করুন</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Suggested quick prompt chips */}
            {messages.length <= 2 && (
              <View style={styles.suggestedContainer}>
                <Text style={styles.suggestedLabel}>প্রস্তাবিত প্রশ্নাবলী:</Text>
                <View style={styles.suggestedRow}>
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.suggestedChip}
                      onPress={() => handleSend(q)}
                    >
                      <Text style={styles.suggestedChipText}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.msgBubble,
                  m.role === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={
                    m.role === 'user' ? styles.userMsgText : styles.aiMsgText
                  }
                  selectable={true}
                >
                  {m.text}
                </Text>
              </View>
            ))}

            {loading && (
              <View style={[styles.msgBubble, styles.aiBubble]}>
                <ActivityIndicator size="small" color={tokens.brand.primary} />
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="এই খবর নিয়ে প্রশ্ন করুন..."
              placeholderTextColor={tokens.text.tertiary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => handleSend()}
              disabled={loading || !inputText.trim()}
            >
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

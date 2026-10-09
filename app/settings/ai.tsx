import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useThemedStyles, useThemeTokens } from '../../theme';
import {
  AiProvider,
  ByokAiConfig,
  getByokAiConfig,
  saveByokAiConfig,
  testAiConnection,
  PROVIDER_METADATA,
} from '../../services/byokAiService';
import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { AmarDeshLogo } from '../../components/AmarDeshLogo';

export default function AiSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();

  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(
    PROVIDER_METADATA.gemini.defaultModel
  );
  const [showKey, setShowKey] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    getByokAiConfig().then((cfg) => {
      setProvider(cfg.provider);
      setApiKey(cfg.apiKey);
      setEnabled(cfg.enabled);
      if (cfg.model) {
        setSelectedModel(cfg.model);
      } else {
        setSelectedModel(PROVIDER_METADATA[cfg.provider].defaultModel);
      }
    });
  }, []);

  const meta = PROVIDER_METADATA[provider];

  const handleProviderChange = (newProv: AiProvider) => {
    setProvider(newProv);
    setSelectedModel(PROVIDER_METADATA[newProv].defaultModel);
    setTestResult(null);
  };

  const handleOpenKeyPortal = () => {
    Linking.openURL(meta.keyHelpUrl).catch(() => {
      Alert.alert(
        'লিংক খুলতে ব্যর্থ',
        `অনুগ্রহ করে ব্রাউজারে এই লিংকটি ভিজিট করুন:\n${meta.keyHelpUrl}`
      );
    });
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(meta.keyHelpUrl);
    setCopiedLink(true);
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = setTimeout(() => setCopiedLink(false), 2500);
    Alert.alert('লিংক কপি হয়েছে', `${meta.portalName}-এর অফিসিয়াল পেজ লিংক ক্লিপবোর্ডে কপি করা হয়েছে:\n${meta.keyHelpUrl}`);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      Alert.alert('সতর্কতা', 'অনুগ্রহ করে প্রথমে আপনার এপিআই কি লিখুন।');
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await testAiConnection(provider, apiKey.trim(), selectedModel);
    setTesting(false);
    setTestResult(result);
    if (result.success && result.detectedModel) {
      setSelectedModel(result.detectedModel);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await saveByokAiConfig({
      provider,
      apiKey: apiKey.trim(),
      model: selectedModel,
      enabled,
    });
    setSaving(false);
    Alert.alert('সফল', 'AI সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
  };

  const handleClearKey = () => {
    Alert.alert(
      'এপিআই কি মুছে ফেলুন',
      'আপনি কি সংরক্ষিত এপিআই কি মুছে ফেলতে চান?',
      [
        { text: 'বাতিল', style: 'cancel' },
        {
          text: 'মুছে ফেলুন',
          style: 'destructive',
          onPress: async () => {
            setApiKey('');
            setTestResult(null);
            await saveByokAiConfig({
              provider,
              apiKey: '',
              model: selectedModel,
              enabled,
            });
            Alert.alert('সফল', 'এপিআই কি মুছে ফেলা হয়েছে।');
          },
        },
      ]
    );
  };

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: tokens.surface.subtle,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: getSafeHeaderPaddingTop(insets.top, 8),
        paddingBottom: 14,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 0.5,
        borderBottomColor: tokens.border.subtle,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
      },
      backButton: {
        padding: 6,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
      },
      title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: tokens.text.primary,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      },
      content: {
        padding: 16,
        paddingBottom: 40,
      },
      heroCard: {
        backgroundColor: tokens.brand.surface,
        borderRadius: tokens.radii.lg,
        padding: 16,
        marginBottom: 18,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
        ...tokens.shadows.card,
      },
      heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
      },
      heroTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tokens.brand.primary,
      },
      heroBody: {
        fontSize: 13,
        color: tokens.text.primary,
        lineHeight: 19,
      },
      securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0, 107, 63, 0.15)',
      },
      securityText: {
        fontSize: 11.5,
        color: tokens.brand.primary,
        fontWeight: '600',
      },
      sectionLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
        marginTop: 6,
      },
      providerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
      },
      providerPill: {
        flex: 1,
        minWidth: '45%',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: tokens.radii.lg,
        backgroundColor: tokens.surface.base,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        alignItems: 'center',
        ...tokens.shadows.sm,
      },
      activeProviderPill: {
        backgroundColor: tokens.brand.surface,
        borderColor: tokens.brand.primary,
        borderWidth: 1.5,
      },
      providerPillText: {
        fontSize: 13,
        color: tokens.text.primary,
        fontWeight: '500',
        marginTop: 4,
      },
      activeProviderPillText: {
        color: tokens.brand.primary,
        fontWeight: 'bold',
      },
      freeTag: {
        fontSize: 10,
        color: tokens.brand.primary,
        backgroundColor: tokens.surface.elevated,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: tokens.radii.pill,
        marginTop: 4,
        fontWeight: '600',
      },
      // Direct Key Collection Action Card
      portalCard: {
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
        ...tokens.shadows.card,
      },
      portalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      portalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
      },
      portalTitle: {
        fontSize: 14.5,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      portalBadge: {
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      portalBadgeText: {
        fontSize: 11,
        color: tokens.brand.primary,
        fontWeight: '700',
      },
      portalDesc: {
        fontSize: 12.5,
        color: tokens.text.secondary,
        lineHeight: 18,
        marginBottom: 12,
      },
      openPortalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.brand.primary,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: tokens.radii.pill,
        gap: 8,
        marginBottom: 8,
        ...tokens.shadows.sm,
      },
      openPortalButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      copyLinkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.surface.elevated,
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        gap: 6,
      },
      copyLinkButtonText: {
        fontSize: 12,
        color: tokens.text.secondary,
        fontWeight: '600',
      },
      stepsBox: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: tokens.border.subtle,
        gap: 6,
      },
      stepsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: tokens.text.primary,
        marginBottom: 2,
      },
      stepItem: {
        fontSize: 11.5,
        color: tokens.text.secondary,
        lineHeight: 16,
      },
      card: {
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        padding: 16,
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      autoModelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: tokens.brand.surface,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: tokens.radii.pill,
        marginBottom: 14,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      autoModelBadgeText: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: '600',
        flex: 1,
      },
      inputLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: tokens.text.primary,
        marginBottom: 6,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.md,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        paddingHorizontal: 12,
        marginBottom: 10,
      },
      input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 14,
        color: tokens.text.primary,
      },
      statusBox: {
        borderRadius: tokens.radii.md,
        padding: 12,
        marginTop: 12,
      },
      statusSuccess: {
        backgroundColor: tokens.brand.surface,
        borderWidth: 0.5,
        borderColor: tokens.brand.primary,
      },
      statusError: {
        backgroundColor: tokens.brand.crimsonSurface,
        borderWidth: 0.5,
        borderColor: tokens.status.error,
      },
      statusText: {
        fontSize: 13,
        lineHeight: 18,
      },
      buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
      },
      testButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.surface.elevated,
        paddingVertical: 12,
        borderRadius: tokens.radii.pill,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        gap: 6,
        ...tokens.shadows.sm,
      },
      testButtonText: {
        fontSize: 13,
        color: tokens.text.primary,
        fontWeight: '600',
      },
      saveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.brand.primary,
        paddingVertical: 12,
        borderRadius: tokens.radii.pill,
        gap: 6,
        ...tokens.shadows.sm,
      },
      saveButtonText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      clearButton: {
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 8,
      },
      clearButtonText: {
        fontSize: 13,
        color: tokens.status.error,
        fontWeight: '600',
      },
      featuresCard: {
        backgroundColor: tokens.surface.base,
        borderRadius: tokens.radii.lg,
        padding: 16,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.card,
      },
      featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 12,
      },
      featureIcon: {
        marginTop: 2,
      },
      featureTitle: {
        fontSize: 13.5,
        fontWeight: 'bold',
        color: tokens.text.primary,
        marginBottom: 2,
      },
      featureDesc: {
        fontSize: 12,
        color: tokens.text.secondary,
        lineHeight: 16,
      },
    })
  );

  return (
    <View style={styles.container}>
      {/* Edge-to-Edge Safe Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="ফিরে যান"
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={tokens.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>AI সহকারী সেটিংস</Text>
        </View>
        <AmarDeshLogo height={22} variant="png" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Ionicons name="sparkles" size={20} color={tokens.brand.primary} />
            <Text style={styles.heroTitle}>স্মার্ট AI সহকারী</Text>
          </View>
          <Text style={styles.heroBody}>
            আপনার নিজস্ব পার্সোনাল এপিআই কি ব্যবহার করে ৩-পয়েন্ট দ্রুত সারসংক্ষেপ ও ইন্টারেক্টিভ প্রশ্নোত্তর উপভোগ করুন।
          </Text>
          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={14} color={tokens.brand.primary} />
            <Text style={styles.securityText}>
              ১০০% ব্যক্তিগত ও নিরাপদ: আপনার কি শুধুমাত্র আপনার ফোনে সুরক্ষিত থাকে
            </Text>
          </View>
        </View>

        {/* Provider Selector */}
        <Text style={styles.sectionLabel}>AI প্রোভাইডার নির্বাচন করুন</Text>
        <View style={styles.providerRow}>
          {(['gemini', 'groq', 'deepseek', 'openai'] as AiProvider[]).map((prov) => {
            const isSelected = provider === prov;
            const pMeta = PROVIDER_METADATA[prov];
            return (
              <TouchableOpacity
                key={prov}
                style={[
                  styles.providerPill,
                  isSelected && styles.activeProviderPill,
                ]}
                onPress={() => handleProviderChange(prov)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={prov === 'gemini' ? 'logo-google' : 'hardware-chip-outline'}
                  size={20}
                  color={isSelected ? tokens.brand.primary : tokens.text.secondary}
                />
                <Text
                  style={[
                    styles.providerPillText,
                    isSelected && styles.activeProviderPillText,
                  ]}
                >
                  {pMeta.name}
                </Text>
                {pMeta.freeTierAvailable && (
                  <Text style={styles.freeTag}>বিনামূল্যে উপলব্ধ</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Direct Action Card: Go Directly to AI API Key Collection */}
        <View style={styles.portalCard}>
          <View style={styles.portalHeader}>
            <View style={styles.portalTitleRow}>
              <Ionicons name="key" size={18} color={tokens.brand.primary} />
              <Text style={styles.portalTitle}>{meta.portalName}</Text>
            </View>
            {meta.freeTierAvailable ? (
              <View style={styles.portalBadge}>
                <Text style={styles.portalBadgeText}>১০০% ফ্রি কি</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.portalDesc}>
            {meta.freeTierNote}. নিচের বাটনে ট্যাপ করে সরাসরি {meta.name}-এর অফিশিয়াল কি তৈরির পেইজে প্রবেশ করুন।
          </Text>

          {/* Primary CTA: Open directly in browser */}
          <TouchableOpacity
            style={styles.openPortalButton}
            onPress={handleOpenKeyPortal}
            activeOpacity={0.8}
          >
            <Ionicons name="open-outline" size={18} color="#FFFFFF" />
            <Text style={styles.openPortalButtonText}>
              সরাসরি API Key পেজে যান ↗
            </Text>
          </TouchableOpacity>

          {/* Copy Link button */}
          <TouchableOpacity
            style={styles.copyLinkButton}
            onPress={handleCopyLink}
            activeOpacity={0.75}
          >
            <Ionicons
              name={copiedLink ? 'checkmark-circle' : 'copy-outline'}
              size={15}
              color={copiedLink ? tokens.brand.primary : tokens.text.secondary}
            />
            <Text style={styles.copyLinkButtonText}>
              {copiedLink ? 'লিংক কপি হয়েছে!' : 'পোর্টাল লিংক কপি করুন'}
            </Text>
          </TouchableOpacity>

          {/* 3-Step Guide */}
          <View style={styles.stepsBox}>
            <Text style={styles.stepsTitle}>কীভাবে এপিআই কি পাবেন:</Text>
            {meta.steps.map((st, idx) => (
              <Text key={idx} style={styles.stepItem}>
                {idx + 1}. {st}
              </Text>
            ))}
          </View>
        </View>

        {/* Provider Config & Verified Model Selection Card */}
        <View style={styles.card}>
          {/* Auto-detected Best Model Banner */}
          <View style={styles.autoModelBadge}>
            <Ionicons name="sparkles" size={15} color={tokens.brand.primary} />
            <Text style={styles.autoModelBadgeText}>
              সর্বোত্তম ও দ্রুততম AI মডেলটি স্বয়ংক্রিয়ভাবে সক্রিয় থাকবে
            </Text>
          </View>

          {/* API Key Input */}
          <Text style={styles.inputLabel}>{meta.name} API Key</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={meta.placeholder}
              placeholderTextColor={tokens.text.tertiary}
              value={apiKey}
              onChangeText={(txt) => {
                setApiKey(txt);
                setTestResult(null);
              }}
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowKey(!showKey)}>
              <Ionicons
                name={showKey ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={tokens.interactive.inactive}
              />
            </TouchableOpacity>
          </View>

          {/* Test Status Banner */}
          {testResult && (
            <View
              style={[
                styles.statusBox,
                testResult.success ? styles.statusSuccess : styles.statusError,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: testResult.success
                      ? tokens.brand.primary
                      : tokens.status.error,
                  },
                ]}
              >
                {testResult.success ? '✓ ' : '✕ '}
                {testResult.message}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestConnection}
              disabled={testing}
            >
              {testing ? (
                <ActivityIndicator size="small" color={tokens.text.primary} />
              ) : (
                <>
                  <Ionicons name="flash-outline" size={16} color={tokens.text.primary} />
                  <Text style={styles.testButtonText}>সংযোগ পরীক্ষা</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>সংরক্ষণ করুন</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {apiKey.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearKey}
            >
              <Text style={styles.clearButtonText}>এপিআই কি মুছে ফেলুন</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* AI Features in App */}
        <Text style={styles.sectionLabel}>অ্যাপে অন্তর্ভুক্ত এআই সুবিধাসমূহ</Text>
        <View style={styles.featuresCard}>
          <View style={styles.featureItem}>
            <Ionicons
              name="list"
              size={18}
              color={tokens.brand.primary}
              style={styles.featureIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>৩-পয়েন্ট বুলেট সারসংক্ষেপ</Text>
              <Text style={styles.featureDesc}>
                যেকোনো দীর্ঘ খবরের মূল নির্যাস মাত্র ৩টি সুস্পষ্ট পয়েন্টে এক নজরে উপস্থাপন করে।
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons
              name="chatbubbles"
              size={18}
              color={tokens.brand.primary}
              style={styles.featureIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>সংবাদ নিয়ে এআই সহকারী (Q&A)</Text>
              <Text style={styles.featureDesc}>
                খবর পড়ার সময় যেকোনো ঘটনা, পটভূমি বা পরিণতি নিয়ে সরাসরি প্রশ্ন করার সুবিধা।
              </Text>
            </View>
          </View>

          <View style={[styles.featureItem, { marginBottom: 0 }]}>
            <Ionicons
              name="bulb"
              size={18}
              color={tokens.brand.primary}
              style={styles.featureIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>কঠিন শব্দের সহজ ব্যাখ্যা</Text>
              <Text style={styles.featureDesc}>
                অর্থনৈতিক, আইনি ও সাংবিধানিক জটিল পরিভাষা সাধারণ মানুষের বোঝার উপযোগী করে ব্যাখ্যা করে।
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

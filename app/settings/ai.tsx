import React, { useState, useEffect } from 'react';
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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeTokens } from '../../theme';
import {
  AiProvider,
  ByokAiConfig,
  getByokAiConfig,
  saveByokAiConfig,
  testAiConnection,
  PROVIDER_METADATA,
} from '../../services/byokAiService';

export default function AiSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tokens = useThemeTokens();

  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getByokAiConfig().then((cfg) => {
      setProvider(cfg.provider);
      setApiKey(cfg.apiKey);
      setEnabled(cfg.enabled);
    });
  }, []);

  const meta = PROVIDER_METADATA[provider];

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      Alert.alert('সতর্কতা', 'অনুগ্রহ করে প্রথমে আপনার এপিআই কি লিখুন।');
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await testAiConnection(provider, apiKey.trim());
    setTesting(false);
    setTestResult(result);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveByokAiConfig({
      provider,
      apiKey: apiKey.trim(),
      model: meta.defaultModel,
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
              model: meta.defaultModel,
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
        paddingHorizontal: 16,
        paddingTop: insets.top > 0 ? insets.top : 12,
        paddingBottom: 14,
        backgroundColor: tokens.surface.base,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.default,
      },
      backButton: {
        padding: 4,
        marginRight: 12,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tokens.text.primary,
      },
      content: {
        padding: 16,
        paddingBottom: 40,
      },
      heroCard: {
        backgroundColor: tokens.brand.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
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
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 107, 63, 0.15)',
      },
      securityText: {
        fontSize: 11,
        color: tokens.brand.primary,
        fontWeight: '600',
      },
      sectionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: tokens.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
        marginTop: 8,
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
        borderRadius: 10,
        backgroundColor: tokens.surface.base,
        borderWidth: 1,
        borderColor: tokens.border.default,
        alignItems: 'center',
      },
      activeProviderPill: {
        backgroundColor: tokens.brand.surface,
        borderColor: tokens.brand.primary,
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
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
      },
      card: {
        backgroundColor: tokens.surface.base,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: tokens.border.default,
      },
      providerDesc: {
        fontSize: 13,
        color: tokens.text.secondary,
        lineHeight: 18,
        marginBottom: 12,
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
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tokens.border.default,
        paddingHorizontal: 12,
        marginBottom: 10,
      },
      input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 14,
        color: tokens.text.primary,
      },
      helpLinkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
      },
      helpLink: {
        fontSize: 12,
        color: tokens.brand.primary,
        fontWeight: '600',
      },
      statusBox: {
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
      },
      statusSuccess: {
        backgroundColor: tokens.brand.surface,
        borderWidth: 1,
        borderColor: tokens.brand.primary,
      },
      statusError: {
        backgroundColor: tokens.brand.crimsonSurface,
        borderWidth: 1,
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
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tokens.border.strong,
        gap: 6,
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
        borderRadius: 8,
        gap: 6,
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
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: tokens.border.default,
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
        fontSize: 14,
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={tokens.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>AI সহকারী ও BYOK সেটিংস</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Ionicons name="sparkles" size={20} color={tokens.brand.primary} />
            <Text style={styles.heroTitle}>Bring Your Own Key (BYOK)</Text>
          </View>
          <Text style={styles.heroBody}>
            আপনার পছন্দের AI প্রোভাইডারের নিজস্ব API কি দিয়ে অ্যাপের ৩-পয়েন্ট বুলেট সারসংক্ষেপ ও সংবাদ বিশ্লেষণ সক্ষম করুন।
          </Text>
          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={14} color={tokens.brand.primary} />
            <Text style={styles.securityText}>
              সম্পূর্ণ নিরাপদ: আপনার কি শুধুমাত্র আপনার ফোনে সুরক্ষিত থাকে
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
                onPress={() => {
                  setProvider(prov);
                  setTestResult(null);
                }}
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

        {/* Provider Config Card */}
        <View style={styles.card}>
          <Text style={styles.providerDesc}>{meta.description}</Text>

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

          <View style={styles.helpLinkRow}>
            <TouchableOpacity onPress={() => Linking.openURL(meta.keyHelpUrl)}>
              <Text style={styles.helpLink}>
                এপিআই কি কীভাবে পাবেন? ({meta.name}) ↗
              </Text>
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

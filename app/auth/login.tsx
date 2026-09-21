import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import {
  signInWithEmail,
  createAccountWithEmail,
  signInWithGoogle,
  signInWithApple,
} from '../../services/firebase/authService';

export default function AuthScreen() {
  const router = useRouter();
  // Edge-to-edge: pad content below the status bar
  const insets = useSafeAreaInsets();
  const { tokens } = useTheme();
  const colors = {
    background: tokens.surface.base,
    text: tokens.text.primary,
    textSecondary: tokens.text.secondary,
    primary: tokens.brand.primary,
    border: tokens.border.default,
    white: '#FFFFFF',
  };
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'প্রমাণীকরণ ত্রুটি ঘটেছে';

  const handleEmailAuth = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('ত্রুটি', 'ইমেইল ঠিকানা দিন');
      return;
    }

    if (!password) {
      Alert.alert('ত্রুটি', 'পাসওয়ার্ড দিন');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('ত্রুটি', 'পাসওয়ার্ড মিলছে না');
      return;
    }

    if (password.length < 6) {
      Alert.alert('ত্রুটি', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        Alert.alert('সফল', 'সফলভাবে লগইন হয়েছে');
      } else {
        await createAccountWithEmail(email, password);
        Alert.alert('সফল', 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে');
      }
      
      router.back();
    } catch (error: unknown) {
      Alert.alert('ত্রুটি', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      Alert.alert('সফল', 'Google দিয়ে সফলভাবে লগইন হয়েছে');
      router.back();
    } catch (error: unknown) {
      Alert.alert('ত্রুটি', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);

    try {
      await signInWithApple();
      Alert.alert('সফল', 'Apple দিয়ে সফলভাবে লগইন হয়েছে');
      router.back();
    } catch (error: unknown) {
      Alert.alert('ত্রুটি', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            {isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="ইমেইল ঠিকানা"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text, flex: 1 }]}
              placeholder="পাসওয়ার্ড"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password (for signup) */}
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleEmailAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.submitButtonText, { color: colors.white }]}>
                {isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>অথবা</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Login Buttons */}
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: colors.border }]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={[styles.socialButtonText, { color: colors.text }]}>
              Google দিয়ে চালিয়ে যান
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.socialButton, { borderColor: colors.border }]}
              onPress={handleAppleSignIn}
              disabled={isLoading}
            >
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                Apple দিয়ে চালিয়ে যান
              </Text>
            </TouchableOpacity>
          )}

          {/* Toggle Login/Signup */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={[styles.toggleText, { color: colors.primary }]}>
              {isLogin
                ? 'অ্যাকাউন্ট নেই? তৈরি করুন'
                : 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            আপনার ডেটা সুরক্ষিত এবং এনক্রিপ্টেড
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  privacyText: {
    fontSize: 12,
    marginLeft: 8,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';

interface DistrictPickerModalProps {
  visible: boolean;
  selectedDivision?: string;
  isGps?: boolean;
  onSelectDivision?: (division: string) => void;
  onRequestGps: () => Promise<void> | void;
  onResetDhaka: () => Promise<void> | void;
  onClose: () => void;
}

export const DistrictPickerModal: React.FC<DistrictPickerModalProps> = ({
  visible,
  selectedDivision = 'ঢাকা',
  isGps = false,
  onRequestGps,
  onResetDhaka,
  onClose,
}) => {
  const [loadingGps, setLoadingGps] = useState(false);

  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'flex-end',
      },
      content: {
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: tokens.radii['2xl'],
        borderTopRightRadius: tokens.radii['2xl'],
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 36,
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
      titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: tokens.text.primary,
        letterSpacing: -0.2,
      },
      closeIconButton: {
        width: 32,
        height: 32,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
      },
      infoBox: {
        backgroundColor: tokens.surface.elevated,
        borderRadius: tokens.radii.md,
        padding: 14,
        marginTop: 16,
        marginBottom: 18,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      infoText: {
        fontSize: 13,
        lineHeight: 20,
        color: tokens.text.secondary,
      },
      optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: tokens.radii.lg,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        marginBottom: 12,
        backgroundColor: tokens.surface.base,
        ...tokens.shadows.card,
      },
      activeOptionCard: {
        borderColor: tokens.brand.primary,
        borderWidth: 1.5,
        backgroundColor: tokens.brand.surface,
      },
      optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
      },
      iconCircle: {
        width: 44,
        height: 44,
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        alignItems: 'center',
        justifyContent: 'center',
      },
      activeIconCircle: {
        backgroundColor: tokens.brand.primary,
      },
      textCol: {
        flex: 1,
      },
      optionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tokens.text.primary,
        marginBottom: 3,
      },
      activeOptionTitle: {
        color: tokens.brand.primary,
      },
      optionDesc: {
        fontSize: 12,
        color: tokens.text.secondary,
        lineHeight: 16,
      },
      closeBtn: {
        marginTop: 8,
        paddingVertical: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: tokens.radii.pill,
        backgroundColor: tokens.surface.elevated,
        borderWidth: 0.5,
        borderColor: tokens.border.subtle,
        ...tokens.shadows.sm,
      },
      closeBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: tokens.text.secondary,
      },
    })
  );

  const handleGpsPress = async () => {
    try {
      setLoadingGps(true);
      await onRequestGps();
      onClose();
    } finally {
      setLoadingGps(false);
    }
  };

  const handleDhakaPress = async () => {
    await onResetDhaka();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Ionicons name="moon-outline" size={20} color={styles.activeOptionTitle.color} />
              <Text style={styles.title}>নামাজের সময়সূচি নির্ধারণ</Text>
            </View>
            <TouchableOpacity style={styles.closeIconButton} onPress={onClose} activeOpacity={0.7} accessibilityLabel="বন্ধ করুন">
              <Ionicons name="close" size={20} color={styles.closeBtnText.color} />
            </TouchableOpacity>
          </View>

          {/* Explanation Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              সারাদেশের জন্য ডিফল্ট হিসেবে <Text style={{ fontWeight: 'bold' }}>ঢাকার সময়সূচি</Text> দেখানো হয়। আপনার এলাকার শতভাগ নির্ভুল ও স্থানীয় নামাজের সময়সূচি পেতে GPS লোকেশন ব্যবহার করুন।
            </Text>
          </View>

          {/* Option 1: Use GPS */}
          <TouchableOpacity
            style={[styles.optionCard, isGps && styles.activeOptionCard]}
            onPress={handleGpsPress}
            activeOpacity={0.75}
            disabled={loadingGps}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, isGps && styles.activeIconCircle]}>
                {loadingGps ? (
                  <ActivityIndicator size="small" color={isGps ? '#fff' : styles.activeOptionTitle.color} />
                ) : (
                  <Ionicons
                    name="navigate"
                    size={20}
                    color={isGps ? '#fff' : styles.activeOptionTitle.color}
                  />
                )}
              </View>
              <View style={styles.textCol}>
                <Text style={[styles.optionTitle, isGps && styles.activeOptionTitle]}>
                  GPS দিয়ে স্থানীয় সময়সূচি
                </Text>
                <Text style={styles.optionDesc}>
                  {isGps
                    ? `বর্তমান অবস্থান: ${selectedDivision} (GPS সক্রিয়)`
                    : 'ডিভাইসের রিয়েল-টাইম অবস্থান অনুযায়ী স্থানীয় সময় হিসাব করুন'}
                </Text>
              </View>
            </View>
            {isGps ? (
              <Ionicons name="checkmark-circle" size={22} color={styles.activeOptionTitle.color} />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={styles.optionDesc.color} />
            )}
          </TouchableOpacity>

          {/* Option 2: Dhaka Default */}
          <TouchableOpacity
            style={[styles.optionCard, !isGps && styles.activeOptionCard]}
            onPress={handleDhakaPress}
            activeOpacity={0.75}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, !isGps && styles.activeIconCircle]}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={!isGps ? '#fff' : styles.activeOptionTitle.color}
                />
              </View>
              <View style={styles.textCol}>
                <Text style={[styles.optionTitle, !isGps && styles.activeOptionTitle]}>
                  ঢাকা (ডিফল্ট প্রমিত সময়)
                </Text>
                <Text style={styles.optionDesc}>
                  {!isGps ? 'বর্তমানে সক্রিয়' : 'সারাদেশের প্রমিত হিসেবে ঢাকার সময়সূচি বহাল রাখুন'}
                </Text>
              </View>
            </View>
            {!isGps ? (
              <Ionicons name="checkmark-circle" size={22} color={styles.activeOptionTitle.color} />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={styles.optionDesc.color} />
            )}
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.75}>
            <Text style={styles.closeBtnText}>বন্ধ করুন</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

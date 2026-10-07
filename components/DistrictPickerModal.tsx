import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../theme';
import { BANGLADESH_DIVISIONS } from '../services/prayerTimesService';

interface DistrictPickerModalProps {
  visible: boolean;
  selectedDivision: string;
  onSelectDivision: (division: string) => void;
  onClose: () => void;
}

export const DistrictPickerModal: React.FC<DistrictPickerModalProps> = ({
  visible,
  selectedDivision,
  onSelectDivision,
  onClose,
}) => {
  const styles = useThemedStyles((tokens) =>
    StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'flex-end',
      },
      content: {
        backgroundColor: tokens.surface.base,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 36,
        maxHeight: '65%',
        borderWidth: 1,
        borderColor: tokens.border.default,
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
      divisionList: {
        paddingVertical: 8,
      },
      divisionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
      },
      activeDivisionItem: {
        backgroundColor: tokens.brand.surface,
      },
      divisionText: {
        fontSize: 15,
        color: tokens.text.primary,
      },
      activeDivisionText: {
        color: tokens.brand.primary,
        fontWeight: 'bold',
      },
      closeBtnText: {
        color: tokens.text.secondary,
      },
    })
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>আপনার বিভাগ নির্বাচন করুন</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={styles.closeBtnText.color} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.divisionList} showsVerticalScrollIndicator={false}>
            {BANGLADESH_DIVISIONS.map((div) => {
              const isSelected = div === selectedDivision;
              return (
                <TouchableOpacity
                  key={div}
                  style={[styles.divisionItem, isSelected && styles.activeDivisionItem]}
                  onPress={() => {
                    onSelectDivision(div);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.divisionText,
                      isSelected && styles.activeDivisionText,
                    ]}
                  >
                    {div} বিভাগ
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={styles.activeDivisionText.color}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

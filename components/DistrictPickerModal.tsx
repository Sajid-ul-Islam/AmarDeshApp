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
        maxHeight: '60%',
      },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 12,
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
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
      },
      divisionText: {
        fontSize: 15,
        color: tokens.text.primary,
      },
      activeDivisionText: {
        color: tokens.brand.primary,
        fontWeight: 'bold',
      },
    })
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>আপনার বিভাগ নির্বাচন করুন</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.divisionList}>
            {BANGLADESH_DIVISIONS.map((div) => {
              const isSelected = div === selectedDivision;
              return (
                <TouchableOpacity
                  key={div}
                  style={styles.divisionItem}
                  onPress={() => {
                    onSelectDivision(div);
                    onClose();
                  }}
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
                    <Ionicons name="checkmark-circle" size={20} color="#006B3F" />
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

import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { useState } from 'react';

interface AddWeightModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (weight: number) => void;
}

export default function AddWeightModal({ visible, onClose, onAdd }: AddWeightModalProps) {
  const [weight, setWeight] = useState('');

  const handleAdd = () => {
    if (!weight) {
      return;
    }
    
    onAdd(parseFloat(weight));
    setWeight('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">Log Weight</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Weight (lbs)</Text>
            <TextInput
              className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
              placeholder="175"
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          <TouchableOpacity
            onPress={handleAdd}
            className="bg-emerald-500 rounded-xl py-4 items-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">Log Weight</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { useState } from 'react';

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (exercise: { name: string; duration: number; calories: number }) => void;
}

export default function AddExerciseModal({ visible, onClose, onAdd }: AddExerciseModalProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const quickActivities = ['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga', 'Gym', 'Dancing', 'Sports'];

  const handleAdd = () => {
    if (!name || !duration || !calories) {
      return;
    }
    
    onAdd({
      name,
      duration: parseInt(duration),
      calories: parseInt(calories)
    });
    
    // Reset form
    setName('');
    setDuration('');
    setCalories('');
    onClose();
  };

  const handleQuickSelect = (activity: string) => {
    setName(activity);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">Add Exercise</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Quick Select</Text>
              <View className="flex-row flex-wrap gap-2">
                {quickActivities.map((activity) => (
                  <TouchableOpacity
                    key={activity}
                    onPress={() => handleQuickSelect(activity)}
                    className={`rounded-full px-4 py-2 ${
                      name === activity ? 'bg-emerald-500' : 'bg-gray-100'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-sm font-medium ${
                      name === activity ? 'text-white' : 'text-gray-700'
                    }`}>
                      {activity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Exercise Name</Text>
              <TextInput
                className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                placeholder="e.g., Morning Run"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="flex-row gap-3 mb-6">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">Duration (min)</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                  placeholder="30"
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">Calories Burned</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                  placeholder="250"
                  keyboardType="numeric"
                  value={calories}
                  onChangeText={setCalories}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAdd}
              className="bg-emerald-500 rounded-xl py-4 items-center mb-4"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">Add Exercise</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

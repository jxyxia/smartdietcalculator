import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { useState } from 'react';

interface AddFoodModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (food: { name: string; calories: number; protein: number; carbs: number; fat: number; meal: string }) => void;
  selectedMeal?: string;
}

export default function AddFoodModal({ visible, onClose, onAdd, selectedMeal = 'Breakfast' }: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [meal, setMeal] = useState(selectedMeal);

  const handleAdd = () => {
    if (!name || !calories) {
      return;
    }
    
    onAdd({
      name,
      calories: parseInt(calories),
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      meal
    });
    
    // Reset form
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
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
        <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">Add Food</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Food Name</Text>
              <TextInput
                className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                placeholder="e.g., Grilled Chicken"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Calories</Text>
              <TextInput
                className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                placeholder="0"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
              />
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">Protein (g)</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                  placeholder="0"
                  keyboardType="numeric"
                  value={protein}
                  onChangeText={setProtein}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">Carbs (g)</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                  placeholder="0"
                  keyboardType="numeric"
                  value={carbs}
                  onChangeText={setCarbs}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">Fat (g)</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                  placeholder="0"
                  keyboardType="numeric"
                  value={fat}
                  onChangeText={setFat}
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Meal</Text>
              <View className="flex-row flex-wrap gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => (
                  <TouchableOpacity
                    key={mealType}
                    onPress={() => setMeal(mealType)}
                    className={`rounded-full px-5 py-3 ${
                      meal === mealType ? 'bg-emerald-500' : 'bg-gray-100'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`font-medium ${
                      meal === mealType ? 'text-white' : 'text-gray-700'
                    }`}>
                      {mealType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAdd}
              className="bg-emerald-500 rounded-xl py-4 items-center mb-4"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">Add Food</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

import { View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

interface MealCardProps {
  mealType?: string;
  calories?: number;
  items?: number;
  onAdd?: () => void;
}

export default function MealCard({ 
  mealType = 'Breakfast',
  calories = 0,
  items = 0,
  onAdd = () => {}
}: MealCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">{mealType}</Text>
          {items > 0 ? (
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-gray-900">{calories}</Text>
              <Text className="text-sm text-gray-500 ml-1">cal</Text>
              <Text className="text-sm text-gray-400 ml-2">• {items} items</Text>
            </View>
          ) : (
            <Text className="text-sm text-gray-400">No items added</Text>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={onAdd}
          className="bg-emerald-500 rounded-full p-3"
          activeOpacity={0.7}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

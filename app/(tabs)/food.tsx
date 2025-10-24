import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ScanBarcode, Clock } from 'lucide-react-native';
import { useState } from 'react';
import AddFoodModal from '@/components/AddFoodModal';

const RECENT_FOODS = [
  { name: 'Grilled Chicken Breast', calories: 165, protein: 31, serving: '100g' },
  { name: 'Brown Rice', calories: 112, carbs: 24, serving: '100g' },
  { name: 'Greek Yogurt', calories: 59, protein: 10, serving: '100g' },
  { name: 'Banana', calories: 89, carbs: 23, serving: '1 medium' },
  { name: 'Almonds', calories: 164, fat: 14, serving: '28g' },
];

export default function FoodScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addFoodModalVisible, setAddFoodModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');

  const handleScanBarcode = () => {
    Alert.alert(
      'Barcode Scanner',
      'Camera permission required. Scan product barcode to automatically add nutrition info.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Camera', onPress: () => Alert.alert('Scanner', 'Barcode scanner would open here') }
      ]
    );
  };

  const handleRecentFoods = () => {
    Alert.alert('Recent Foods', 'Showing your most frequently logged foods');
  };

  const handleMealSelect = (meal: string) => {
    setSelectedMeal(meal);
    Alert.alert('Meal Selected', `Adding food to ${meal}`);
  };

  const handleFoodSelect = (food: typeof RECENT_FOODS[0]) => {
    Alert.alert(
      'Add Food',
      `Add ${food.name} (${food.calories} cal)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => {
            setAddFoodModalVisible(true);
          }
        }
      ]
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('Search', `Searching for "${searchQuery}"...`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-900">Food Tracking</Text>
          <Text className="text-sm text-gray-500 mt-1">Search and log your meals</Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center">
            <Search size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="Search foods..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3">
            <TouchableOpacity 
              className="flex-1 bg-emerald-500 rounded-2xl p-4 items-center"
              activeOpacity={0.8}
              onPress={handleScanBarcode}
            >
              <ScanBarcode size={28} color="#ffffff" />
              <Text className="text-white font-semibold mt-2">Scan Barcode</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-blue-500 rounded-2xl p-4 items-center"
              activeOpacity={0.8}
              onPress={handleRecentFoods}
            >
              <Clock size={28} color="#ffffff" />
              <Text className="text-white font-semibold mt-2">Recent Foods</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meal Categories */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Add to Meal</Text>
          <View className="flex-row flex-wrap gap-2">
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
              <TouchableOpacity
                key={meal}
                className={`rounded-full px-5 py-3 border ${
                  selectedMeal === meal 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'bg-white border-gray-200'
                }`}
                activeOpacity={0.7}
                onPress={() => handleMealSelect(meal)}
              >
                <Text className={`font-medium ${
                  selectedMeal === meal ? 'text-white' : 'text-gray-700'
                }`}>
                  {meal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Foods */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Recent Foods</Text>
          {RECENT_FOODS.map((food, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3"
              activeOpacity={0.7}
              onPress={() => handleFoodSelect(food)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-semibold text-gray-900 flex-1">{food.name}</Text>
                <Text className="text-sm text-gray-500">{food.serving}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-emerald-50 rounded-full px-3 py-1 mr-2">
                  <Text className="text-emerald-700 font-semibold text-sm">{food.calories} cal</Text>
                </View>
                {food.protein && (
                  <View className="bg-blue-50 rounded-full px-3 py-1 mr-2">
                    <Text className="text-blue-700 text-sm">{food.protein}g protein</Text>
                  </View>
                )}
                {food.carbs && (
                  <View className="bg-orange-50 rounded-full px-3 py-1 mr-2">
                    <Text className="text-orange-700 text-sm">{food.carbs}g carbs</Text>
                  </View>
                )}
                {food.fat && (
                  <View className="bg-pink-50 rounded-full px-3 py-1">
                    <Text className="text-pink-700 text-sm">{food.fat}g fat</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <AddFoodModal
        visible={addFoodModalVisible}
        onClose={() => setAddFoodModalVisible(false)}
        onAdd={(food) => {
          Alert.alert('Success', `${food.name} added to ${food.meal}!`);
          setAddFoodModalVisible(false);
        }}
        selectedMeal={selectedMeal}
      />
    </SafeAreaView>
  );
}
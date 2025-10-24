import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import CalorieRing from '@/components/CalorieRing';
import MacroCard from '@/components/MacroCard';
import MealCard from '@/components/MealCard';
import AddFoodModal from '@/components/AddFoodModal';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: string;
}

export default function DashboardScreen() {
  const [foods, setFoods] = useState<FoodItem[]>([
    { name: 'Oatmeal with Berries', calories: 300, protein: 10, carbs: 50, fat: 5, meal: 'Breakfast' },
    { name: 'Scrambled Eggs', calories: 150, protein: 12, carbs: 2, fat: 10, meal: 'Breakfast' },
    { name: 'Grilled Chicken Salad', calories: 400, protein: 35, carbs: 20, fat: 15, meal: 'Lunch' },
    { name: 'Brown Rice', calories: 250, protein: 5, carbs: 50, fat: 2, meal: 'Lunch' },
    { name: 'Salmon with Vegetables', calories: 350, protein: 30, carbs: 15, fat: 18, meal: 'Dinner' },
  ]);
  const [addFoodModalVisible, setAddFoodModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');

  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = foods.reduce((sum, food) => sum + food.fat, 0);

  const getMealStats = (mealType: string) => {
    const mealFoods = foods.filter(f => f.meal === mealType);
    return {
      calories: mealFoods.reduce((sum, f) => sum + f.calories, 0),
      items: mealFoods.length
    };
  };

  const handleAddFood = (food: FoodItem) => {
    setFoods([...foods, food]);
    Alert.alert('Success', `${food.name} added to ${food.meal}!`);
  };

  const handleMealAdd = (mealType: string) => {
    setSelectedMeal(mealType);
    setAddFoodModalVisible(true);
  };

  const handleSmartSuggestions = () => {
    const remaining = 2000 + 350 - totalCalories;
    Alert.alert(
      'Smart Suggestions',
      `You have ${remaining} calories remaining today.\n\nRecommended meals:\n• Grilled Chicken (165 cal)\n• Greek Yogurt (120 cal)\n• Mixed Nuts (170 cal)`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-900">Dashboard</Text>
          <Text className="text-sm text-gray-500 mt-1">Track your nutrition goals</Text>
        </View>

        {/* Calorie Ring */}
        <View className="bg-white mx-6 rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <CalorieRing consumed={totalCalories} goal={2000} burned={350} />
        </View>

        {/* Macros */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Macronutrients</Text>
          <View className="gap-3">
            <MacroCard label="Protein" current={totalProtein} goal={150} unit="g" color="#3b82f6" />
            <MacroCard label="Carbs" current={totalCarbs} goal={250} unit="g" color="#f59e0b" />
            <MacroCard label="Fat" current={totalFat} goal={65} unit="g" color="#ec4899" />
          </View>
        </View>

        {/* Smart Suggestions */}
        <View className="px-6 mb-6">
          <TouchableOpacity 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 flex-row items-center"
            activeOpacity={0.8}
            onPress={handleSmartSuggestions}
          >
            <View className="bg-white/20 rounded-full p-3 mr-4">
              <Sparkles size={24} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base mb-1">Smart Suggestions</Text>
              <Text className="text-white/80 text-sm">Get meal recommendations for today</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Meals */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Today's Meals</Text>
          {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => {
            const stats = getMealStats(mealType);
            return (
              <MealCard 
                key={mealType}
                mealType={mealType} 
                calories={stats.calories} 
                items={stats.items}
                onAdd={() => handleMealAdd(mealType)}
              />
            );
          })}
        </View>
      </ScrollView>

      <AddFoodModal
        visible={addFoodModalVisible}
        onClose={() => setAddFoodModalVisible(false)}
        onAdd={handleAddFood}
        selectedMeal={selectedMeal}
      />
    </SafeAreaView>
  );
}
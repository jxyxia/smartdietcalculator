import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import AddWeightModal from '@/components/AddWeightModal';

const ACHIEVEMENTS = [
  { icon: Flame, title: '7 Day Streak', description: 'Logged meals for 7 days', unlocked: true, color: '#f59e0b' },
  { icon: Target, title: 'Goal Crusher', description: 'Hit your calorie goal 10 times', unlocked: true, color: '#10b981' },
  { icon: Trophy, title: 'Macro Master', description: 'Perfect macros for 5 days', unlocked: false, color: '#6366f1' },
];

interface WeightData {
  week: string;
  weight: number;
}

export default function ProgressScreen() {
  const [weightData, setWeightData] = useState<WeightData[]>([
    { week: 'Week 1', weight: 180 },
    { week: 'Week 2', weight: 178 },
    { week: 'Week 3', weight: 177 },
    { week: 'Week 4', weight: 175 },
  ]);
  const [addWeightModalVisible, setAddWeightModalVisible] = useState(false);

  const maxWeight = Math.max(...weightData.map(d => d.weight));
  const currentWeight = weightData[weightData.length - 1].weight;
  const startWeight = weightData[0].weight;
  const weightLost = startWeight - currentWeight;

  const handleAddWeight = (weight: number) => {
    const weekNumber = weightData.length + 1;
    setWeightData([...weightData, { week: `Week ${weekNumber}`, weight }]);
    Alert.alert('Success', `Weight logged: ${weight} lbs`);
  };

  const handleAchievementPress = (achievement: typeof ACHIEVEMENTS[0]) => {
    if (achievement.unlocked) {
      Alert.alert(
        achievement.title,
        `${achievement.description}\n\nUnlocked on ${new Date().toLocaleDateString()}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        achievement.title,
        `${achievement.description}\n\nKeep going to unlock this achievement!`,
        [{ text: 'OK' }]
      );
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-900">Progress</Text>
          <Text className="text-sm text-gray-500 mt-1">Track your journey</Text>
        </View>

        {/* Stats Overview */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <View className="bg-emerald-50 rounded-full w-10 h-10 items-center justify-center mb-3">
                <Flame size={20} color="#10b981" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">7</Text>
              <Text className="text-sm text-gray-500 mt-1">Day Streak</Text>
            </View>
            
            <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <View className="bg-blue-50 rounded-full w-10 h-10 items-center justify-center mb-3">
                <TrendingUp size={20} color="#3b82f6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">-{weightLost}</Text>
              <Text className="text-sm text-gray-500 mt-1">lbs Lost</Text>
            </View>
          </View>
        </View>

        {/* Weight Tracking */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</Text>
            
            <View className="flex-row items-end justify-between h-40 mb-4">
              {weightData.map((data, index) => {
                const heightPercentage = (data.weight / maxWeight) * 100;
                return (
                  <View key={index} className="flex-1 items-center">
                    <View className="w-full items-center mb-2">
                      <Text className="text-sm font-semibold text-gray-900">{data.weight}</Text>
                    </View>
                    <View 
                      className="w-12 bg-emerald-500 rounded-t-lg"
                      style={{ height: `${heightPercentage}%` }}
                    />
                    <Text className="text-xs text-gray-500 mt-2">{data.week}</Text>
                  </View>
                );
              })}
            </View>
            
            <TouchableOpacity 
              className="bg-emerald-500 rounded-xl py-3 items-center"
              activeOpacity={0.8}
              onPress={() => setAddWeightModalVisible(true)}
            >
              <Text className="text-white font-semibold">Log Weight</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Achievements */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Achievements</Text>
          {ACHIEVEMENTS.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <TouchableOpacity
                key={index}
                className={`rounded-2xl p-4 shadow-sm border mb-3 ${
                  achievement.unlocked 
                    ? 'bg-white border-gray-100' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                activeOpacity={0.7}
                onPress={() => handleAchievementPress(achievement)}
              >
                <View className="flex-row items-center">
                  <View 
                    className={`rounded-full w-12 h-12 items-center justify-center mr-4 ${
                      achievement.unlocked ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: `${achievement.color}20` }}
                  >
                    <Icon size={24} color={achievement.color} />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base font-semibold mb-1 ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </Text>
                    <Text className={`text-sm ${
                      achievement.unlocked ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.unlocked && (
                    <View className="bg-emerald-500 rounded-full w-8 h-8 items-center justify-center">
                      <Text className="text-white font-bold">✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <AddWeightModal
        visible={addWeightModalVisible}
        onClose={() => setAddWeightModalVisible(false)}
        onAdd={handleAddWeight}
      />
    </SafeAreaView>
  );
}
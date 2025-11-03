import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Footprints, Dumbbell, Plus, Watch, RefreshCw } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { smartwatchSync, HealthData } from '@/services/smartwatchSync';
import AddExerciseModal from '@/components/AddExerciseModal';

interface Exercise {
  name: string;
  duration: number;
  calories: number;
  time: string;
}

export default function ActivityScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: 'Morning Run', duration: 30, calories: 250, time: '7:00 AM' },
    { name: 'Weight Training', duration: 45, calories: 180, time: '6:00 PM' },
  ]);
  const [steps, setSteps] = useState(8547);
  const [caloriesBurned, setCaloriesBurned] = useState(430);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);

  const stepsGoal = 10000;
  const stepsPercentage = (steps / stepsGoal) * 100;

  useEffect(() => {
    const status = smartwatchSync.getSyncStatus();
    setIsConnected(status.isConnected);
    // Set initial values in the sync service
    smartwatchSync.setCurrentValues(steps, caloriesBurned);
  }, []);

  const handleConnectWatch = async () => {
    if (isConnected) {
      smartwatchSync.disconnectDevice();
      setIsConnected(false);
    } else {
      setIsSyncing(true);
      const connected = await smartwatchSync.connectDevice();
      setIsConnected(connected);
      setIsSyncing(false);
    }
  };

  const handleSyncData = async () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect your smartwatch first');
      return;
    }

    setIsSyncing(true);
    try {
      const healthData: HealthData = await smartwatchSync.syncHealthData();
      setSteps(healthData.steps);
      setCaloriesBurned(healthData.calories);
    } catch (error) {
      // Error already handled in service
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    setExercises([...exercises, { ...exercise, time }]);
    setCaloriesBurned(caloriesBurned + exercise.calories);
    Alert.alert('Success', `${exercise.name} logged successfully!`);
  };

  const handleQuickAdd = (activity: string) => {
    Alert.alert(
      'Quick Add',
      `Add ${activity} to your exercise log?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: () => setAddExerciseModalVisible(true) }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-900">Activity</Text>
          <Text className="text-sm text-gray-500 mt-1">Track your daily movement</Text>
        </View>

        {/* Steps Card */}
        <View className="px-6 mb-4">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="bg-blue-50 rounded-full w-12 h-12 items-center justify-center mr-3">
                  <Footprints size={24} color="#3b82f6" />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-gray-900">Steps Today</Text>
                  <Text className="text-sm text-gray-500">{stepsGoal.toLocaleString()} goal</Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                {isSyncing ? (
                  <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={handleSyncData}
                    disabled={!isConnected}
                  >
                    <RefreshCw size={24} color={isConnected ? "#3b82f6" : "#9ca3af"} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={handleConnectWatch}
                >
                  <Watch size={24} color={isConnected ? "#10b981" : "#9ca3af"} />
                </TouchableOpacity>
              </View>
            </View>

            {isConnected && (
              <View className="bg-emerald-50 rounded-xl p-3 mb-4">
                <Text className="text-emerald-700 text-sm font-medium">
                  ✓ Smartwatch Connected
                </Text>
              </View>
            )}

            <Text className="text-5xl font-bold text-gray-900 mb-4">{steps.toLocaleString()}</Text>

            <View className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
              <View 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(stepsPercentage, 100)}%` }}
              />
            </View>
            <Text className="text-sm text-gray-500">
              {Math.max(stepsGoal - steps, 0).toLocaleString()} steps to goal
            </Text>
          </View>
        </View>

        {/* Calories Burned */}
        <View className="px-6 mb-4">
          <View className="bg-orange-500 rounded-2xl p-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/80 text-sm mb-1">Total Calories Burned</Text>
                <Text className="text-white text-4xl font-bold">{caloriesBurned}</Text>
                <Text className="text-white/80 text-sm mt-1">From activities today</Text>
              </View>
              <View className="bg-white/20 rounded-full w-16 h-16 items-center justify-center">
                <Dumbbell size={32} color="#ffffff" />
              </View>
            </View>
          </View>
        </View>

        {/* Exercise Log */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Exercise Log</Text>
            <TouchableOpacity 
              className="bg-emerald-500 rounded-full w-10 h-10 items-center justify-center"
              activeOpacity={0.7}
              onPress={() => setAddExerciseModalVisible(true)}
            >
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {exercises.map((exercise, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-semibold text-gray-900 flex-1">{exercise.name}</Text>
                <Text className="text-sm text-gray-500">{exercise.time}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-blue-50 rounded-full px-3 py-1 mr-2">
                  <Text className="text-blue-700 text-sm">{exercise.duration} min</Text>
                </View>
                <View className="bg-orange-50 rounded-full px-3 py-1">
                  <Text className="text-orange-700 font-semibold text-sm">{exercise.calories} cal</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Add Exercise */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Add</Text>
          <View className="flex-row flex-wrap gap-2">
            {['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga', 'Gym'].map((activity) => (
              <TouchableOpacity
                key={activity}
                className="bg-white rounded-full px-5 py-3 border border-gray-200"
                activeOpacity={0.7}
                onPress={() => handleQuickAdd(activity)}
              >
                <Text className="text-gray-700 font-medium">{activity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <AddExerciseModal
        visible={addExerciseModalVisible}
        onClose={() => setAddExerciseModalVisible(false)}
        onAdd={handleAddExercise}
      />
    </SafeAreaView>
  );
}
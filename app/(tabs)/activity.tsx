import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Footprints, 
  Dumbbell, 
  Plus, 
  Watch, 
  RefreshCw, 
  Settings, 
  ChevronRight 
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Make sure this path resolves correctly:
import { smartwatchSync, HealthData } from '../../services/smartwatchSync';

import AddExerciseModal from '../../components/AddExerciseModal';

interface Exercise {
  name: string;
  duration: number;
  calories: number;
  time: string;
}

/** Input shape coming from the modal (no time) */
type NewExerciseInput = {
  name: string;
  duration: number;
  calories: number;
};

export default function ActivityScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: 'Morning Run', duration: 30, calories: 250, time: '7:00 AM' },
    { name: 'Weight Training', duration: 45, calories: 180, time: '6:00 PM' },
  ]);
  const [steps, setSteps] = useState(8547);
  const [caloriesBurned, setCaloriesBurned] = useState(430);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);
  const [isSmartWatchConnected, setIsSmartWatchConnected] = useState(false);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [hasSeenSmartWatchBanner, setHasSeenSmartWatchBanner] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2m ago');

  const stepsGoal = 10000;
  const stepsPercentage = (steps / stepsGoal) * 100;

  useEffect(() => {
    const status = smartwatchSync.getSyncStatus?.();
    if (status) setIsConnected(status.isConnected);

    smartwatchSync.setCurrentValues?.(steps, caloriesBurned);
    checkSmartWatchConnection();
    loadBannerPreference();
  }, []);

  const checkSmartWatchConnection = async () => {
    try {
      const connected = await AsyncStorage.getItem('connected_bluetooth_devices');
      if (connected) {
        const devices = JSON.parse(connected);
        if (devices.length > 0) {
          setIsSmartWatchConnected(true);
          setConnectedDeviceName(devices[0].name || 'Smartwatch');
        }
      }
    } catch (error) {
      console.error('Check connection error:', error);
    }
  };

  const loadBannerPreference = async () => {
    try {
      const seen = await AsyncStorage.getItem('smartwatch_banner_seen');
      setHasSeenSmartWatchBanner(seen === 'true');
    } catch (error) {
      console.error('Load banner preference error:', error);
    }
  };

  const handleConnectWatch = async () => {
    if (isConnected) {
      smartwatchSync.disconnectDevice?.();
      setIsConnected(false);
    } else {
      setIsSyncing(true);
      const connected = await smartwatchSync.connectDevice?.();
      setIsConnected(!!connected);
      setIsSyncing(false);
    }
  };

  const handleSyncData = async () => {
    if (!isConnected && !isSmartWatchConnected) {
      Alert.alert('Not Connected', 'Please connect your smartwatch first');
      return;
    }

    setIsSyncing(true);
    try {
      const healthData: HealthData = await smartwatchSync.syncHealthData?.();
      if (healthData) {
        setSteps(healthData.steps);
        setCaloriesBurned(healthData.calories);
        setLastSyncTime('Just now');
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const refreshActivityData = () => {
    checkSmartWatchConnection();
    handleSyncData();
  };

  /**
   * Now accepts the input from the modal (no `time`).
   * Builds the full Exercise object including `time`.
   */
  const handleAddExercise = (input: NewExerciseInput) => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const newExercise: Exercise = { ...input, time };
    setExercises(prev => [...prev, newExercise]);
    setCaloriesBurned(prev => prev + input.calories);
    Alert.alert('Success', `${input.name} logged successfully!`);
  };

  const handleQuickAdd = (activity: string) => {
    Alert.alert('Quick Add', `Add ${activity} to your exercise log?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Add', onPress: () => setAddExerciseModalVisible(true) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white">
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
            <View>
              <Text className="text-2xl font-bold text-gray-900">Activity</Text>
              <Text className="text-gray-600 text-sm mt-0.5">Track your daily movement</Text>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={refreshActivityData}
                className="w-10 h-10 items-center justify-center mr-2"
                activeOpacity={0.7}
              >
                <RefreshCw size={22} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity
                // cast to any to satisfy strict route literal types
                onPress={() => router.push('/features/smartwatch-connect' as any)}
                className="w-10 h-10 items-center justify-center relative mr-2"
                activeOpacity={0.7}
              >
                <Watch size={22} color={isSmartWatchConnected ? '#10B981' : '#6B7280'} />
                {isSmartWatchConnected && (
                  <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/settings' as any)}
                className="w-10 h-10 items-center justify-center"
                activeOpacity={0.7}
              >
                <Settings size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Steps Card */}
        <View className="px-6 mb-4 mt-6">
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
              <View className="flex-row items-center">
                {isSmartWatchConnected && (
                  <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center mr-2">
                    <Watch size={12} color="#10B981" />
                    <Text className="text-green-700 text-xs font-medium ml-1">Synced</Text>
                  </View>
                )}
                {isSyncing ? (
                  <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleSyncData}
                    disabled={!isConnected && !isSmartWatchConnected}
                  >
                    <RefreshCw
                      size={20}
                      color={(isConnected || isSmartWatchConnected) ? '#3b82f6' : '#9ca3af'}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

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
      </ScrollView>

      <AddExerciseModal
        visible={addExerciseModalVisible}
        onClose={() => setAddExerciseModalVisible(false)}
        onAdd={handleAddExercise}
      />
    </SafeAreaView>
  );
}

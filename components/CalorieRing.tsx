import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CalorieRingProps {
  consumed?: number;
  goal?: number;
  burned?: number;
}

export default function CalorieRing({ 
  consumed = 1450, 
  goal = 2000,
  burned = 350 
}: CalorieRingProps) {
  const remaining = goal + burned - consumed;
  const percentage = Math.min((consumed / (goal + burned)) * 100, 100);
  
  const size = 220;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="items-center justify-center">
      <View className="relative">
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-5xl font-bold text-gray-900">{remaining}</Text>
          <Text className="text-sm text-gray-500 mt-1">Remaining</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between w-full mt-6 px-4">
        <View className="items-center">
          <Text className="text-2xl font-semibold text-gray-900">{consumed}</Text>
          <Text className="text-xs text-gray-500 mt-1">Consumed</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-emerald-500">+{burned}</Text>
          <Text className="text-xs text-gray-500 mt-1">Burned</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-gray-900">{goal}</Text>
          <Text className="text-xs text-gray-500 mt-1">Goal</Text>
        </View>
      </View>
    </View>
  );
}

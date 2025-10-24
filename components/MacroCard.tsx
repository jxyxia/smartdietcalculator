import { View, Text } from 'react-native';

interface MacroCardProps {
  label?: string;
  current?: number;
  goal?: number;
  unit?: string;
  color?: string;
}

export default function MacroCard({ 
  label = 'Protein',
  current = 65,
  goal = 150,
  unit = 'g',
  color = '#3b82f6'
}: MacroCardProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <Text className="text-sm font-medium text-gray-600 mb-3">{label}</Text>
      
      <View className="flex-row items-end mb-3">
        <Text className="text-3xl font-bold text-gray-900">{current}</Text>
        <Text className="text-sm text-gray-500 ml-1 mb-1">/ {goal}{unit}</Text>
      </View>
      
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View 
          className="h-full rounded-full" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color 
          }} 
        />
      </View>
    </View>
  );
}

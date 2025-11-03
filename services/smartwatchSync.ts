import { Alert, Platform } from 'react-native';

// Mock smartwatch data sync service
// In production, integrate with Apple HealthKit or Google Fit

export interface HealthData {
  steps: number;
  calories: number;
  heartRate?: number;
  distance?: number;
  activeMinutes?: number;
}

export interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  deviceName: string;
}

class SmartwatchSyncService {
  private syncStatus: SyncStatus = {
    isConnected: false,
    lastSync: null,
    deviceName: 'No device connected'
  };

  private currentSteps: number = 8547;
  private currentCalories: number = 430;

  async connectDevice(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate connection delay
      setTimeout(() => {
        this.syncStatus = {
          isConnected: true,
          lastSync: new Date(),
          deviceName: Platform.OS === 'ios' ? 'Apple Watch' : 'Wear OS Watch'
        };
        Alert.alert(
          'Connected!',
          `Successfully connected to ${this.syncStatus.deviceName}`,
          [{ text: 'OK' }]
        );
        resolve(true);
      }, 1500);
    });
  }

  async syncHealthData(): Promise<HealthData> {
    if (!this.syncStatus.isConnected) {
      Alert.alert('Not Connected', 'Please connect your smartwatch first');
      throw new Error('Device not connected');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        // Increment steps by 10-15 only
        const stepsIncrement = Math.floor(Math.random() * 6) + 10; // 10-15
        const caloriesIncrement = Math.floor(Math.random() * 5) + 3; // 3-7
        
        this.currentSteps += stepsIncrement;
        this.currentCalories += caloriesIncrement;
        
        const data: HealthData = {
          steps: this.currentSteps,
          calories: this.currentCalories,
          heartRate: Math.floor(Math.random() * 40) + 60,
          distance: Math.floor(Math.random() * 5) + 2,
          activeMinutes: Math.floor(Math.random() * 60) + 30
        };
        
        this.syncStatus.lastSync = new Date();
        
        Alert.alert(
          'Sync Complete!',
          `Updated: ${data.steps} steps (+${stepsIncrement}), ${data.calories} calories burned`,
          [{ text: 'OK' }]
        );
        
        resolve(data);
      }, 1000);
    });
  }

  disconnectDevice(): void {
    this.syncStatus = {
      isConnected: false,
      lastSync: null,
      deviceName: 'No device connected'
    };
    Alert.alert('Disconnected', 'Smartwatch disconnected', [{ text: 'OK' }]);
  }

  getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  isConnected(): boolean {
    return this.syncStatus.isConnected;
  }

  // Method to set initial values from the UI
  setCurrentValues(steps: number, calories: number): void {
    this.currentSteps = steps;
    this.currentCalories = calories;
  }
}

export const smartwatchSync = new SmartwatchSyncService();
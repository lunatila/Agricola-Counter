import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

/**
 * Hides the Android system navigation bar on mount.
 * This identical effect was previously copy-pasted into every screen.
 */
export function useAndroidNavBar(): void {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);
}

/**
 * App.tsx — Navigation root
 *
 * Stack: Home → Upload → StylePicker → Processing → Result
 * All screens are dark-themed with no native header (custom headers per screen).
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from './src/types';
import HomeScreen        from './src/screens/HomeScreen';
import UploadScreen      from './src/screens/UploadScreen';
import StylePickerScreen from './src/screens/StylePickerScreen';
import ProcessingScreen  from './src/screens/ProcessingScreen';
import ResultScreen      from './src/screens/ResultScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              cardStyle:   { backgroundColor: '#f6f4ff' },
              // Smooth slide transition
              cardStyleInterpolator: ({ current, layouts }) => ({
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange:  [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              }),
            }}
          >
            <Stack.Screen name="Home"        component={HomeScreen}        />
            <Stack.Screen name="Upload"      component={UploadScreen}      />
            <Stack.Screen name="StylePicker" component={StylePickerScreen} />
            <Stack.Screen name="Processing"  component={ProcessingScreen}  />
            <Stack.Screen name="Result"      component={ResultScreen}      />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Button } from 'react-native';

export default function SignIn() {
  const bgOpacity = useRef(new Animated.Value(0)).current;  // Animation for background opacity
  const logoOpacity = useRef(new Animated.Value(0)).current; // Animation for logo opacity
  const textOpacity = useRef(new Animated.Value(0)).current; // Animation for text opacity
  const [isVisible, setIsVisible] = useState(true);  // State to track visibility
  // const { login } = useAuth();
  useEffect(() => {
    fadeIn();
      setTimeout(() => {
        fadeOut();
        router.replace('./splashscreen')
      }, 2000);
  }, [])


  // Function to trigger fade-in
  const fadeIn = () => {
    Animated.parallel([
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 1000, 
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const fadeOut = () => {

    Animated.parallel([
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 2000, // 1 second fade-out
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      
    ]).start(() => setIsVisible(false));  // After fading out, hide the component
  };

  const router = useRouter();
  return (
    isVisible && (
      <LinearGradient
            colors={['#0097b2', '#7ed957']} // Gradient colors (from green to light green)
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
            className='flex-1 items-center justify-center gap-5'
          >

        <Animated.Image
          className="w-24 h-24 absolute bottom-[400px]"
          source={require('../assets/images/ec_logo.png')}
          style={{ opacity: logoOpacity }} // Apply opacity animation
        />
        <Animated.Text
          className="absolute bottom-[370px] text-[#ffffff] text-4xl font-bold"
          style={{ opacity: textOpacity }} // Apply opacity animation
        >
          SHELTER GUARD
        </Animated.Text>

      </LinearGradient>
    )
  );
}
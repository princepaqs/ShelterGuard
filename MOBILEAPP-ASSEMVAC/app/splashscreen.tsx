import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Image, TouchableOpacity } from 'react-native';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function SignIn() {
  const bgOpacity = useRef(new Animated.Value(0)).current; // Animation for background opacity
  const logoOpacity = useRef(new Animated.Value(0)).current; // Animation for logo opacity
  const textOpacity = useRef(new Animated.Value(0)).current; // Animation for text opacity
  const [isVisible, setIsVisible] = useState(true); // State to track visibility
  const router = useRouter();

  useEffect(() => {
    fadeIn();
  }, []);

  // Function to trigger fade-in
  const fadeIn = () => {
    Animated.parallel([
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fadeOut = () => {
    Animated.parallel([
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start(() => setIsVisible(false)); // After fading out, hide the component
  };

  return (
    isVisible && (
      <LinearGradient
        colors={['#0097b2', '#7ed957']} // Gradient colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
        className="flex-1 items-center justify-center gap-5"
      >
        {/* Background Image with Animation */}
        <Animated.Image
          source={require('../assets/images/image.png')}
          style={{ opacity: bgOpacity, position: 'absolute', width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Button continue */}
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 20, right: 20 }}
          onPress={() => router.replace('./signIn')}
        >
          <AnimatedLinearGradient
            colors={['#0097b2', '#7ed957']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ opacity: textOpacity, padding: 10, borderRadius: 50 }}
            className="px-3 py-1 rounded-full"
          >
            <Entypo name="chevron-right" size={45} color="white" />
          </AnimatedLinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    )
  );
}

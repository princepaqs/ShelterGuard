import { AuthContextProvider, useAuth } from '../context/authContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import {  View, Text } from 'react-native';

const MainLayout = () => {  
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  //tabs
  // useEffect(() => {
  //   if (typeof isAuthenticated === 'undefined') return;

  //   const inApp = segments[0] === 'tabs';
  //   if (isAuthenticated && !inApp) {
  //     // Redirect to home - use valid route typing
  //     router.replace('/splashscreen'); 
  //   } else if (isAuthenticated === false) {
  //   }
  // }, [isAuthenticated]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}

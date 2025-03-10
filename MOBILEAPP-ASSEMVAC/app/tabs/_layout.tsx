import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '@/components/HomeHeader';
export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name='homepage'
        options={{
          header: ()=> <HomeHeader/>
        }}
      />
      <Stack.Screen
        name='calamityList'
        options={{
          header: ()=> <HomeHeader/>
        }}
      />
      <Stack.Screen
        name='evacuationCenter'
        options={{
          header: ()=> <HomeHeader/>
        }}
      />
      <Stack.Screen
        name='qrcode'
        options={{
          header: ()=> <HomeHeader/>
        }}
      />
      <Stack.Screen
        name='qrscanner'
        options={{
          header: ()=> <HomeHeader/>
        }}
      />
      <Stack.Screen
        name='resources'
        options={{
          header: ()=> <HomeHeader/>
        }}
      />
      <Stack.Screen
        name='evacueeList'
        options={{
          header: ()=> <HomeHeader/>
        }}
      />
      <Stack.Screen
        name='evacueeApplication'
        options={{
          header: ()=> <HomeHeader/>
        }}
      />
    </Stack>
  )
}
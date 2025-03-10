import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
interface Calamities {
  id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  date: string;
}

export default function calamityList() {
  const [calamities, setCalamities] = useState<Calamities[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCenters, setFilteredCenters] = useState<Calamities[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All'); // New state for status filter

  useEffect(() => {
    const fetchCalamities = async () => {
      const userRole = await SecureStore.getItemAsync('userRole');
      const API = process.env.EXPO_PUBLIC_API_KEY;
      try {
        const response = await fetch(`${API}/get-calamities`);

        if (!response.ok) {
          throw new Error('Failed to fetch calamities');
        }
        const data = await response.json();
        setCalamities(data);
        setFilteredCenters(data);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchCalamities();
  }, []);

  useEffect(() => {
    let filtered = calamities;

    if (statusFilter !== 'All') {
      filtered = calamities.filter((calamity) => calamity.status === statusFilter);
    }

    if (searchQuery !== '') {
      filtered = filtered.filter(
        (calamity) =>
          calamity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calamity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calamity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calamity.date.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCenters(filtered);
  }, [searchQuery, calamities, statusFilter]);

  return (
    <LinearGradient
      colors={['#0097b2', '#7ed957']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1 "
    >
      <View className="h-24 justify-center px-5 mt-5">
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => router.replace('./homepage')} className="bg-[#0f8799] p-1 rounded-3xl">
            <Entypo name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white"> Calamities </Text>
        </View>
      </View>
      <View className="flex-1 h-screen rounded-t-3xl overflow-hidden bg-[#f0f0f0] px-4">
        <View className="mt-4 bg-[#dfdddd] rounded-full flex-row items-center px-4 py-2">
          <FontAwesome name="search" size={24} color="#19a4a1" />
          <TextInput
            placeholder="Search calamity"
            placeholderTextColor="#aaa"
            className="flex-1 pl-3 text-xs"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <ScrollView
          className="mt-6"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center, index) => (
              <View
                key={index}
                className="flex-row w-full items-center justify-between mt-2 bg-white border-b-4 border-gray-200 p-4 rounded-2xl shadow-md"
              >
                <View className='w-4/5'>
                  <Text className="text-sm font-bold">{center.name}</Text>
                  <Text className="text-xs text-[#aaa]">{center.type}</Text>
                  <View className="flex-col mt-3 space-y-1">
                    <View className="flex-row space-x-1">
                      <Text className="text-xs text-[#aaa]">Status:</Text>
                      <Text className="text-xs text-[#aaa]">{center.status}</Text>
                    </View>
                    <View className="flex-row space-x-1">
                      <Text className="text-xs text-[#aaa]">Date:</Text>
                      <Text className="text-xs text-[#aaa]">{center.date}</Text>
                    </View>
                    <View className="flex-row space-x-1">
                      <Text className="text-xs text-[#aaa]">Description:</Text>
                      <Text className="text-xs text-[#aaa]">{center.description}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center h-1/2">
              <Text>No Calamities</Text>
            </View>
          )}
        </ScrollView>

      </View>
    </LinearGradient>
  );
}

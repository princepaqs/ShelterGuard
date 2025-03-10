import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface EvacuationCenter {
  _id: string;
  name: string;
  capacity: number;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  category: string;
  contact: string;
  images?: string; // Add image property (could be a URL or path)
}

interface Evacuees {
  id: string;
  name: string;
  role: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  additionalDetails: {
    headOfFamilyName: string;
    isPWD: string;
    pwdType: string;
  };
  centerID: string;
}

export default function Homepage() {
  const [evacuationcenters, setEvacuationcenters] = useState<EvacuationCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCenters, setFilteredCenters] = useState<EvacuationCenter[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [role, setRole] = useState<string>(''); 
  const [selectedCenter, setSelectedCenter] = useState<EvacuationCenter | null>(null); // State to manage the modal
  const [evacuees, setEvacuees] = useState<Evacuees[]>([]);

  // New state for storing total evacuees per center
  const [totalEvacueesPerCenter, setTotalEvacueesPerCenter] = useState<{ [key: string]: number }>({});
  console.log(role)
  useEffect(() => {
    const fetchEvacuees = async () => {
      const API = process.env.EXPO_PUBLIC_API_KEY;
      try {
        const response = await fetch(`${API}/get-users`);
        if (!response.ok) {
          throw new Error('Failed to fetch evacuee list');
        }
        const data = await response.json();
        setEvacuees(data);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchEvacuees();
  }, []);

  useEffect(() => {
    const fetchEvacuationcenters = async () => {
      const userRole = await SecureStore.getItemAsync('userRole');
      setRole(userRole ?? 'guest');
      const API = process.env.EXPO_PUBLIC_API_KEY;
      try {
        const response = await fetch(`${API}/get-evacuationcenters`);
        if (!response.ok) {
          throw new Error('Failed to fetch evacuation centers');
        }
        const data = await response.json();
        setEvacuationcenters(data);
        setFilteredCenters(data);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchEvacuationcenters();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCenters(evacuationcenters);
    } else {
      setFilteredCenters(
        evacuationcenters.filter((center) =>
          center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          center.capacity.toString().includes(searchQuery) ||
          center.location.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, evacuationcenters]);

  // Calculate total evacuees for each center
  useEffect(() => {
    const calculateTotalEvacuees = () => {
      // Filter evacuees where the role is 'evacuee'
      const filteredEvacuees = evacuees.filter(evacuee => evacuee.role === 'evacuee');
      
      const evacueeCounts: { [key: string]: number } = {};
  
      filteredEvacuees.forEach((evacuee) => {
        if (evacuee.centerID) {
          evacueeCounts[evacuee.centerID] = (evacueeCounts[evacuee.centerID] || 0) + 1;
        }
      });
  
      setTotalEvacueesPerCenter(evacueeCounts);
    };
  
    calculateTotalEvacuees();
  }, [evacuees]);
  

  const handleModalClose = () => {
    setSelectedCenter(null); // Close modal
  };
  const IMAGE_API = process.env.EXPO_PUBLIC_IMAGE_API_KEY;

  return (
    <LinearGradient
      colors={['#0097b2', '#7ed957']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <View className="h-1/5 justify-center px-5 mt-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/images/ec_logo.png')}
              className="w-10 h-10 mr-3"
            />
            <Text className="text-white text-2xl font-bold">SHELTER GUARD</Text>
          </View>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
            <Feather name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Dropdown */}
        {dropdownVisible && (
          <View
            className="absolute top-16 right-5 bg-white/95 shadow-lg rounded-2xl px-6 py-2 border border-gray-200"
            style={{ zIndex: 1000 }}
          >
            {role === 'guest' ? (
              <Pressable
                onPress={() => {
                  setDropdownVisible(false);
                  router.replace('../signIn');
                }}
                className="py-2"
              >
                <Text className="text-gray-700 text-sm font-bold">Login</Text>
              </Pressable>
            ) : (
              <View>
                <Pressable
                onPress={() => {
                  setDropdownVisible(false);
                  router.replace('../signIn');
                }}
                className="py-2"
              >
                <Text className="text-gray-700 text-sm font-bold">Logout</Text>
              </Pressable>
              </View>
            )}
          </View>
        )}

        <View className="mt-4 bg-white rounded-full flex-row items-center px-4 py-2">
          <FontAwesome name="search" size={24} color="#19a4a1" />
          <TextInput
            placeholder="Evacuation centers near me"
            placeholderTextColor="#aaa"
            className="flex-1 pl-3 text-xs"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </View>

      <View className="flex-1 rounded-t-3xl overflow-hidden">
        <MapView
          className="flex-1"
          initialRegion={{
            latitude: 14.5995,
            longitude: 120.9842,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {filteredCenters.map((center) => (
            <Marker
              key={center._id}
              coordinate={{
                latitude: center.location.coordinates.lat,
                longitude: center.location.coordinates.lng,
              }}
              title={center.name}
              onPress={() => setSelectedCenter(center)} // Show modal on marker click
            />
          ))}
        </MapView>
      </View>

      {/* Modal for evacuation center details */}
      {selectedCenter && (
        <Modal
          visible={!!selectedCenter}
          animationType="slide"
          transparent={true}
          onRequestClose={handleModalClose}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={handleModalClose} // Close modal on click outside
          >
            <View className="flex-1 justify-center items-center">
              <View className="bg-white absolute bottom-2 right-4 left-4 rounded-xl p-6 border border-black/20 shadow-md">
                {/* display image here */}
                {selectedCenter.images && (
                  <Image
                  source={{ uri: `${IMAGE_API}${selectedCenter.images}` }}  // Combine IMAGE_API and selectedCenter.images
                  className="w-full h-40 rounded-xl mb-4"
                  resizeMode="cover"
                />
                )}
                <Text className="text-lg font-bold">{selectedCenter.name}</Text>
                <Text className="text-sm font-semibold my-1">Available Capacity: <Text className='font-normal'>{selectedCenter.capacity - totalEvacueesPerCenter[selectedCenter._id] || selectedCenter.capacity} / {selectedCenter.capacity}</Text></Text>
                <Text className="text-sm">{selectedCenter.location.address}</Text>
                <Text className="text-sm">Capacity: {selectedCenter.capacity}</Text>

                {/* {role === 'admin' &&
                  <TouchableOpacity
                  onPress={() => 
                      router.push('./evacueeApplication')
                    }
                  className="mt-4 px-8 bg-[#333333] py-4 rounded-xl items-center"
                >
                  <Text className="text-white text-lg">Evacuate Here</Text>
                </TouchableOpacity>
                } */}
              </View>
            </View>
          </Pressable>
        </Modal>
      )}

      <View className="flex-row items-center justify-center absolute bottom-5 left-10 right-10 ">
        <View className="flex-row items-center justify-between bg-[#049baf] py-3.5 px-8 space-x-10 rounded-full">
          <TouchableOpacity>
            <MaterialIcons onPress={() => router.push('./calamityList')} name="thunderstorm" size={33} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome6 onPress={() => router.push('./evacuationCenter')} name="house-medical-flag" size={30} color="white" />
          </TouchableOpacity>
          {
            role === 'evacuee'&& (
              <TouchableOpacity>
                <FontAwesome6 onPress={() => router.push('./qrcode')} name="qrcode" size={30} color="white" />
              </TouchableOpacity>
            )
          }
          {
            role === 'worker'&& (
              <TouchableOpacity>
                <FontAwesome6 onPress={() => router.push('./qrscanner')} name="qrcode" size={30} color="white" />
              </TouchableOpacity>
            )
          }
          {role === 'admin' && (
            <TouchableOpacity>
              <MaterialIcons onPress={() => router.push('./evacueeList')} name="groups" size={40} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  images: string;
  contact: string;
  workerName: string;
  workerID: string;
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

export default function EvacuationCenterList() {
  const [evacuationCenters, setEvacuationCenters] = useState<EvacuationCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCenters, setFilteredCenters] = useState<EvacuationCenter[]>([]);
  const [sortDescending, setSortDescending] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<EvacuationCenter | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [role, setRole] = useState<string>(''); 
  const IMAGE_API = process.env.EXPO_PUBLIC_IMAGE_API_KEY;

const [evacuees, setEvacuees] = useState<Evacuees[]>([]);

  // New state for storing total evacuees per center
  const [totalEvacueesPerCenter, setTotalEvacueesPerCenter] = useState<{ [key: string]: number }>({});

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
    const fetchEvacuationCenters = async () => {
      try {
        const userRole = await SecureStore.getItemAsync('userRole');
        setRole(userRole ?? 'guest');
        const API = process.env.EXPO_PUBLIC_API_KEY;
        const response = await fetch(`${API}/get-evacuationcenters`);

        if (!response.ok) {
          throw new Error('Failed to fetch evacuation centers');
        }
        const data = await response.json();
        setEvacuationCenters(data);
        setFilteredCenters(data); // Initialize filtered list with all data
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchEvacuationCenters();
  }, []);

  useEffect(() => {
    let centers = [...evacuationCenters];
    if (searchQuery) {
      centers = centers.filter((center) =>
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    centers.sort((a, b) => (sortDescending ? b.capacity - a.capacity : a.capacity - b.capacity));
    setFilteredCenters(centers);
  }, [searchQuery, evacuationCenters, sortDescending]);

  const handleToggleSort = () => {
    setSortDescending(!sortDescending);
  };

  const handleCenterClick = (center: EvacuationCenter) => {
    setSelectedCenter(center);
    setIsModalVisible(true); // Open the modal when a center is clicked
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCenter(null); // Clear selected center when closing the modal
  };

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


  return (
    <LinearGradient
      colors={['#0097b2', '#7ed957']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <View className="h-24 justify-center px-5 mt-5">
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={() => router.replace('./homepage')}
            className="bg-[#0f8799] p-1 rounded-3xl"
          >
            <Entypo name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white">
            Evacuation Centers
          </Text>
        </View>
      </View>
      <View className="flex-1 h-screen rounded-t-3xl overflow-hidden bg-[#f0f0f0] px-4">
        <View className="mt-4 bg-[#dfdddd] rounded-full flex-row items-center px-4 py-2">
          <FontAwesome name="search" size={24} color="#19a4a1" />
          <TextInput
            placeholder="Search evacuation centers"
            placeholderTextColor="#aaa"
            className="flex-1 pl-3 text-xs"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <TouchableOpacity
          onPress={handleToggleSort}
          className="bg-[#19a4a1] mt-4 py-2 px-4 rounded-lg self-end"
        >
          <View className='flex-row items-center space-x-2'>
          <MaterialIcons name="groups" size={20} color="white" /> 
          <Text className="text-white font-semibold">
            {sortDescending ? 'High' : 'Low'}
          </Text>
          </View>
        </TouchableOpacity>
        <ScrollView
          className="mt-2 mb-10"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center, index) => (
              <TouchableOpacity key={index} onPress={() => handleCenterClick(center)}>
                <View
                  className="flex-col mt-2 bg-white border-b-4 border-gray-200 p-4 rounded-2xl shadow-md"
                >
                   <Image
                      source={{ uri: `${IMAGE_API}${center.images}` }}  // Combine IMAGE_API and selectedCenter.images
                      className="w-full h-40 rounded-xl mb-2"
                      resizeMode="cover"
                    />
                  <View className="flex-col mb-0.5">
                    <Text className="text-sm font-bold">{center.name}</Text>
                    <Text className="text-xs text-[#aaa]">Available Capacity: {center.capacity - totalEvacueesPerCenter[center._id] || center.capacity} / {center.capacity}</Text>
                  </View>
                  <View className="flex-col mt-1 space-y-1">
                    <View className="flex-row space-x-1">
                      <Text className="text-xs font-bold ">Address:</Text>
                      <Text
                        className="text-xs pr-10 "
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {center.location.address}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="flex-1 items-center justify-center h-1/2">
              <Text>No Evacuation Centers Found</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Modal to display evacuation center details */}
      {selectedCenter && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={handleCloseModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-4/5">
              <Text className="text-lg font-bold">{selectedCenter.name}</Text>
              <Text className="text-sm text-gray-600 mt-2">Assgined: {selectedCenter.workerName}</Text>
              <Text className="text-sm text-gray-600 mt-2">Contact: {selectedCenter.contact}</Text>
              <Text className="text-sm text-gray-600 mt-2">Available Capacity: {selectedCenter.capacity - totalEvacueesPerCenter[selectedCenter._id] || selectedCenter.capacity} / {selectedCenter.capacity}</Text>
              <Text className="text-sm text-gray-600 mt-2">Address: {selectedCenter.location.address}</Text>
              <View className="flex-row items-center justify-center space-x-4">
                {role === 'admin' && 
                  <TouchableOpacity
                  onPress={() => 
                    {
                      router.push('./evacueeApplication')
                      SecureStore.setItemAsync('centerName', selectedCenter.name);
                      SecureStore.setItemAsync('centerID', selectedCenter._id);
                    }
                    }
                    className="mt-4 bg-[#19a4a1] px-6 py-2 rounded-lg items-center"
                  >
                    <Text className="text-white font-semibold">Add Evacuee</Text>
                  </TouchableOpacity>
                }
                {role === 'worker' && 
                  <TouchableOpacity
                    onPress={() => 
                    {
                      router.push('./evacueeApplication')
                      SecureStore.setItemAsync('centerName', selectedCenter.name);
                      SecureStore.setItemAsync('centerID', selectedCenter._id);
                    }
                    }
                    className="mt-4 bg-[#19a4a1] px-6 py-2 rounded-lg items-center"
                  >
                    <Text className="text-white font-semibold">Add Evacuee</Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity
                  onPress={handleCloseModal}
                  className="mt-4 bg-[#333333] px-6 py-2 rounded-lg items-center"
                >
                  <Text className="text-white">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
}

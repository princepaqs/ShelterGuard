import { Entypo, EvilIcons, Feather, FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface Evacuees {
  id: string;
  name: string;
  role: string;
  address: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  additionalDetails: {
    headOfFamilyName: string;
    isPWD: string;
    pwdType: string;
  };
}

export default function evacueeList() {
  const [evacuees, setEvacuees] = useState<Evacuees[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCenters, setFilteredCenters] = useState<Evacuees[]>([]);
  const [role, setRole] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false); // For modal visibility
  const [selectedEvacuee, setSelectedEvacuee] = useState<Evacuees | null>(null); // Store selected evacuee's data

  // Filter states
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPWD, setSelectedPWD] = useState('');
  const [selectedPWDType, setSelectedPWDType] = useState('');

  const roles = ['evacuee', 'worker'];
  const pwdOptions = ['Yes', 'No'];
  const pwdTypes = ['none', 'visual', 'hearing', 'mobility', 'cognitive', 'menta'];

  useEffect(() => {
    const fetchEvacuees = async () => {
      const userRole = await SecureStore.getItemAsync('userRole');
      console.log('Role:', userRole);
      setRole(userRole ?? 'guest');
      const API = process.env.EXPO_PUBLIC_API_KEY;
      try {
        const response = await fetch(`${API}/get-users`);
        if (!response.ok) {
          throw new Error('Failed to fetch evacuee list');
        }
        const data = await response.json();
        setEvacuees(data);
        setFilteredCenters(data);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchEvacuees();
  }, []);

  useEffect(() => {
    let filtered = evacuees;
  
    // Exclude evacuees with role = 'admin'
    filtered = filtered.filter((evacuee) => evacuee.role !== 'admin');
    filtered = filtered.filter((evacuee) => evacuee.role !== 'worker');
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((evacuee) =>
        [evacuee.name, evacuee.role, evacuee.contactInfo.phone, evacuee.contactInfo.email]
          .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  
    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter((evacuee) => evacuee.role === selectedRole);
    }
  
    // Filter by PWD
    if (selectedPWD) {
      const isPWD = selectedPWD === 'Yes'; // Convert "Yes" to true, "No" to false
      filtered = filtered.filter((evacuee) => evacuee.additionalDetails.isPWD === isPWD);
    }
  
    // Filter by PWD Type
    if (selectedPWDType) {
      filtered = filtered.filter((evacuee) => evacuee.additionalDetails.pwdType === selectedPWDType);
    }
  
    setFilteredCenters(filtered);
  }, [searchQuery, selectedRole, selectedPWD, selectedPWDType, evacuees]);
  

  const handleEvacueeClick = (evacuee: Evacuees) => {
    setSelectedEvacuee(evacuee);
    setModalVisible(true); // Show the modal when an evacuee is clicked
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvacuee(null);
  };

  return (
    <LinearGradient
      colors={['#0097b2', '#7ed957']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <View className="h-24 justify-center px-5 mt-5">
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => router.replace('./homepage')} className="bg-[#0f8799] p-1 rounded-3xl">
            <Entypo name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white"> Evacuees </Text>
        </View>
      </View>
      <View className="flex-1 h-screen rounded-t-3xl overflow-hidden bg-[#f0f0f0] px-4">
        {/* Search Bar */}
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

        {/* Filter Button */}
        <TouchableOpacity
          onPress={() => setFiltersVisible(!filtersVisible)}
          className="mt-2 bg-[#dfdddd] rounded-lg px-4 py-2  flex-row items-center justify-between"
        >
          <Text className="text-sm font-bold text-gray-700">Filters</Text>
          <FontAwesome6 name={filtersVisible ? 'chevron-up' : 'chevron-down'} size={16} color="black" />
        </TouchableOpacity>

        {/* Filter Dropdown */}
        {filtersVisible && (
          <View className="mt-2 bg-white p-4 rounded-lg shadow">
            {/* Role Filter */}
            <Text className="font-bold text-sm mb-2">Role</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {roles.map((role, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedRole(role === selectedRole ? '' : role)}
                  className={`px-3 py-2 rounded-full ${
                    selectedRole === role ? 'bg-[#19a4a1]' : 'bg-gray-200'
                  } mr-2`}
                >
                  <Text className={`${selectedRole === role ? 'text-white' : 'text-gray-600'}`}>{role}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* PWD Filter */}
            <Text className="font-bold text-sm mt-4 mb-2">PWD</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pwdOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedPWD(option === selectedPWD ? '' : option)}
                  className={`px-3 py-2 rounded-full ${
                    selectedPWD === option ? 'bg-[#19a4a1]' : 'bg-gray-200'
                  } mr-2`}
                >
                  <Text className={`${selectedPWD === option ? 'text-white' : 'text-gray-600'}`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* PWD Type Filter */}
            <Text className="font-bold text-sm mt-4 mb-2">PWD Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pwdTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedPWDType(type === selectedPWDType ? '' : type)}
                  className={`px-3 py-2 rounded-full ${
                    selectedPWDType === type ? 'bg-[#19a4a1]' : 'bg-gray-200'
                  } mr-2`}
                >
                  <Text className={`${selectedPWDType === type ? 'text-white' : 'text-gray-600'}`}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView
          className="mt-6"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEvacueeClick(center)}
              >
                <View
                  className="flex-row w-full items-center justify-between mt-2 bg-white border-b-4 border-gray-200 p-4 rounded-2xl shadow-md"
                >
                  <View className="w-full">
                    <View className='flex-row items-center justify-between'>
                      <View>
                        <Text className="text-sm font-bold">{center.name}</Text>
                        <Text className="text-xs text-[#aaa]">{center.role}</Text>
                      </View>
                      <View>
                        <MaterialCommunityIcons
                          onPress={() => handleEvacueeClick(center)} // Trigger modal on evacuee click 
                          name="dots-horizontal" size={24} color="#777" />
                      </View>
                    </View>
                    <View className="flex-col mt-3 space-y-1">
                      <View className="flex-row space-x-2 items-center">
                        <Feather name="phone" size={14} color="#555" />
                        <Text className="text-xs text-gray-600">{center.contactInfo.phone}</Text>
                      </View>
                      <View className="flex-row space-x-2 items-center">
                        <Feather name="mail" size={14} color="#555" />
                        <Text className="text-xs text-gray-600">{center.contactInfo.email}</Text>
                      </View>
                      <View className="flex-row space-x-2 items-center">
                        <EvilIcons name="location" size={14} color="#555" />
                        <Text className="text-xs text-gray-600">{center.address}</Text>
                      </View>
                    </View>
                  </View>
                  
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-center text-gray-600 mt-6">No evacuees found.</Text>
          )}
        </ScrollView>

        {role === 'admin' && (
          <TouchableOpacity onPress={() => router.push('./evacueeApplication')} className="w-16 h-16 absolute bottom-8 right-6 bg-[#30c06a] items-center justify-center rounded-full">
            <FontAwesome6 name="add" size={35} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal */}
      {modalVisible && selectedEvacuee && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-xl w-3/4">
              <Text className="text-lg font-bold mb-4">Evacuee Details</Text>
              <Text className="text-sm mb-2">
                <Text className="font-bold">Name: </Text>
                {selectedEvacuee.name}
              </Text>
              <Text className="text-sm mb-2">
                <Text className="font-bold">Role: </Text>
                {selectedEvacuee.role}
              </Text>
              <Text className="text-sm mb-2">
                <Text className="font-bold">Phone: </Text>
                {selectedEvacuee.contactInfo.phone}
              </Text>
              <Text className="text-sm mb-2">
                <Text className="font-bold">Email: </Text>
                {selectedEvacuee.contactInfo.email}
              </Text>
              <Text className="text-sm mb-4">
                <Text className="font-bold">PWD Type: </Text>
                {selectedEvacuee.additionalDetails.pwdType}
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                className="bg-[#19a4a1] p-3 rounded-lg mt-4"
              >
                <Text className="text-center text-white font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
}

import { AntDesign, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../context/authContext';

import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from 'react-native';

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

export default function EvacueeList() {
  const [role, setRole] = useState('evacuee');
  const [roleDropdownVisible, setRoleDropdownVisible] = useState(false);

  const [disabilityType, setDisabilityType] = useState('none');
  const [disabilityDropdownVisible, setDisabilityDropdownVisible] = useState(false);
  

  const [isPWD, setIsPWD] = useState(false); // Add the isPWD state here
  const [pwdType, setPwdType] = useState(''); // Optional field for PWD type

  const roles = ['evacuee'];
  const disabilityTypes = ['none', 'visual', 'hearing', 'mobility', 'cognitive', 'menta'];

  const router = useRouter();
  const { evacueeApplication } = useAuth();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [familyHead, setFamilyHead] = useState<string>('');
  const [user, setUser] = useState<string>('');

  const [evacuationCenters, setEvacuationCenters] = useState<EvacuationCenter[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [centerName, setCenterName] = useState('');
  const [centerID, setCenterID] = useState('');
  const [centerDropdownVisible, setcenterDropdownVisible] = useState(false);
  const [evacCenter, setEvacCenter] = useState<string>(''); 
  const [evacCenterID, setEvacCenterID] = useState<string>(''); 
   useEffect(() => {
    
      const fetchEvacuationCenters = async () => {
        try {
          const centerName = await SecureStore.getItemAsync('centerName');
          setCenterName(centerName ?? '');
          const centerID = await SecureStore.getItemAsync('centerID');
          setCenterID(centerID ?? '');
          const API = process.env.EXPO_PUBLIC_API_KEY;
          const response = await fetch(`${API}/get-evacuationcenters`);
  
          if (!response.ok) {
            throw new Error('Failed to fetch evacuation centers');
          }
          const data = await response.json();
          setEvacuationCenters(data);
          setLoading(false);
        } catch (error) {
          setError((error as Error).message);
          setLoading(false);
        }
      };
  
      fetchEvacuationCenters();
    }, []);

  useEffect(() => {
      const fetchEvacuees = async () => {
        const userRole = await SecureStore.getItemAsync('userRole');
        console.log('Role:', userRole);
        setUser(userRole ?? 'guest');
      }
    fetchEvacuees();
  }, []);
  
  const handleSubmit = async () => {
    try {
      // Check if all required fields are filled
      if (!username || !password || !address || !name || !phoneNumber || !email || !familyHead || !centerName || !centerID || !role) {
        Alert.alert('Application', 'Please fill in all the fields.');
        return;
      }
  
      setLoading(true);
      // Pass the fields as individual arguments instead of an object
      await evacueeApplication(
        name,
        role,
        username,
        password,
        address,
        centerName,
        centerID,
        phoneNumber,
        email,
        familyHead,
        isPWD,
        disabilityType
      );
      Alert.alert('Success', 'Application Submitted');
      router.replace('./homepage');
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting your application.');
    } finally {
      setLoading(false);
    }
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
          <TouchableOpacity onPress={() => router.back()} className="bg-[#0f8799] p-1 rounded-3xl">
            <Entypo name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white">{user === 'admin' ? 'Add Evacuee' : 'Evacuee Application'}</Text>
        </View>
      </View>
      <View className="flex-1 h-screen rounded-t-3xl overflow-hidden bg-[#f0f0f0] px-4">
        <ScrollView
          className="mt-6 mb-5"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View className="px-6">
            {/* Name and Role */}
            <View className="w-full flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-bold">Name</Text>
                <TextInput
                  className="border-b-2 border-gray-300 p-2"
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                />
                
              </View>
            </View>

            {/* Role Dropdown */}
            <View className="w-full flex-row space-x-4 mt-4">
              <View className="flex-1">
                <Text className="text-sm font-bold">Role</Text>
                <TouchableOpacity
                  onPress={() => setRoleDropdownVisible(!roleDropdownVisible)}
                  className="border-b-2 border-gray-300 p-2 flex-row items-center justify-between"
                >
                  <Text>{role}</Text>
                  <Entypo name="chevron-down" size={15} color="black" />
                </TouchableOpacity>
                {roleDropdownVisible && (
                  <View className="bg-white border border-gray-300 rounded mt-2">
                    {roles.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setRole(item);
                          setRoleDropdownVisible(false);
                        }}
                        className="p-2"
                      >
                        <Text>{item}</Text>
                        
                      </TouchableOpacity>
                     
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Username and Password */}
            <View className="w-full flex-row space-x-4 mt-4">
              <View className="flex-1">
                <Text className="text-sm font-bold">Username</Text>
                <TextInput
                  className="border-b-2 border-gray-300 p-2"
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold">Password</Text>
                <TextInput
                  className="border-b-2 border-gray-300 p-2"
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <View className="w-full mt-4">
              <Text className="text-sm font-bold">Address</Text>
              <TextInput
                className="border-b-2 border-gray-300 p-2"
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Phone Number and Email */}
            <View className="w-full flex-row space-x-4 mt-4">
              <View className="flex-1">
                <Text className="text-sm font-bold">Phone Number</Text>
                <TextInput
                  className="border-b-2 border-gray-300 p-2"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold">Email</Text>
                <TextInput
                  className="border-b-2 border-gray-300 p-2"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>


            <View className="w-full mt-4">
              <Text className="text-sm font-bold">Center</Text>
              <TextInput
                className="border-b-2 border-gray-300 p-2"
                placeholder="Family Head Name"
                value={centerName}
              />
            </View>


            {/* Family Head */}
            <View className="w-full mt-4">
              <Text className="text-sm font-bold">Family Head</Text>
              <TextInput
                className="border-b-2 border-gray-300 p-2"
                placeholder="Family Head Name"
                value={familyHead}
                onChangeText={setFamilyHead}
              />
            </View>

            {/* Disability Type Dropdown */}
            <View className="w-full flex-row space-x-4 mt-4">
              <View className="flex-1">
                <Text className="text-sm font-bold">Disability Type</Text>
                <TouchableOpacity
                  onPress={() => setDisabilityDropdownVisible(!disabilityDropdownVisible)}
                  className="border-b-2 border-gray-300 p-2 flex-row items-center justify-between"
                >
                  <Text>{disabilityType}</Text>
                  <Entypo name="chevron-down" size={15} color="black" />
                </TouchableOpacity>
                {disabilityDropdownVisible && (
                  <View className="bg-white border border-gray-300 rounded mt-2">
                    {disabilityTypes.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setDisabilityType(item);
                          setDisabilityDropdownVisible(false);
                        }}
                        className="p-2"
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* PWD Checkbox */}
            <View className="w-full mt-4">
              <Text className="text-sm font-bold mb-2">Are you a person with disability?</Text>
              <TouchableOpacity
                onPress={() => setIsPWD(!isPWD)}
                className="flex-row items-center space-x-2 "
              >
                <Text className='bg-gray-200 rounded-md p-2'>{isPWD ? 'Yes' : 'No'}</Text>
                <AntDesign name="swap" size={15} color="black" />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <View className="mt-6">
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-black p-3 rounded-md"
                disabled={loading}
              >
                <Text className="text-white text-center font-bold">
                  {loading ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

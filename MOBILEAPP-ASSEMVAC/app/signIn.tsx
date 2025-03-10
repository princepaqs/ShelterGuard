import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import Loading from '@/components/Loading';
import { useRouter } from 'expo-router';
import ErrorModal from '@/components/ErrorModal';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/authContext';

export default function SignIn() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    try {
    if (!username || !password) {
      setModalMessage('Please enter both username and password.');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    await login(username, password);
    } catch (error) {
      setModalMessage("Incorrect username or password.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  }; 

  const handleContinue = async () => {
    const userRole = 'guest'
    await SecureStore.setItemAsync('userRole', userRole);
    router.replace('/tabs/homepage');
  }

  return (
    <LinearGradient
      colors={['#0097b2', '#7ed957']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className='w-full h-[400px] flex items-start px-10 pt-5 justify-center rounded-r-3xl'>
        <View className='w-full h-full flex-row items-center justify-center'>
          <Image
            className='w-24 h-24'
            source={require('../assets/images/ec_logo.png')}
          />
          <View>
          <Text className='text-white text-2xl font-bold'>SHELTER GUARD</Text>
          <Text className='text-white text-xs '>Emergency Shelter at Your Fingertips</Text>
          </View>
        </View>
        
      </View>

      <View className='bg-[#ffffff] relative w-full h-full rounded-t-3xl flex flex-col'>
      <View className='absolute top-[-120px] mt-10 px-10 items-center  w-full h-[300px] rounded-2xl flex flex-col'>
          <View className='bg-white p-6 w-full h-full rounded-3xl shadow-lg border-2 border-gray-100'>
          <View className='flex flex-col space-y-10 w-full h-full'>

            {/* Username Field */}
            <View>
              <Text className='px-2 pb-1 text-sm font-bold'>Username</Text>
              <View className='flex flex-row px-4 py-2 items-center border-b-2 border-gray-100 rounded-xl'>
                <TextInput
                  style={{ flex: 1, paddingLeft: 8, fontSize: 15, color: 'black' }}
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>

            {/* Password Field */}
            <View>
              <Text className='px-2 pb-1 text-sm font-bold'>Password</Text>
              <View className='flex flex-row px-4 py-2 items-center border-b-2 border-gray-100 rounded-xl'>
                <TextInput
                  style={{ flex: 1, paddingLeft: 8, fontSize: 15, color: 'black' }}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Feather name={passwordVisible ? 'eye' : 'eye-off'} size={15} color="gray" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <View className='absolute bottom-[-140px] w-full'>
              {loading ? (
                <View className='pt-4 flex-1 w-full items-center'>
                  <Loading />
                </View>
              ) : (
                <View className='flex-col space-y-5'>
                  <View className='pt-4 px-10'>
                  <TouchableOpacity onPress={handleLogin} className='bg-[#333333] py-4 rounded-full'>
                    <Text className='text-white text-sm font-bold text-center tracking-wider'>Login</Text>
                  </TouchableOpacity>
                </View>

                <View className='pt-4'>
                  <TouchableOpacity onPress={handleContinue}>
                  <LinearGradient
                    colors={['#0097b2', '#7ed957']} // Gradient colors (from green to light green)
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className='py-0.5 rounded-full'
                  >
                    <Text className='text-white text-sm font-bold text-center tracking-wider py-4'>Continue without Account</Text>
                  </LinearGradient>
                  </TouchableOpacity>
                </View>
                </View>
              )}
            </View>
            </View>
          </View>
        </View>
      
        
      </View>

      {/* Error Modal */}
      <ErrorModal visible={modalVisible} message={modalMessage} onClose={closeModal} />
    </LinearGradient>
  );
}

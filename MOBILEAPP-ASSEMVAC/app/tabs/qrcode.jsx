import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "@/context/authContext";

const QRCodeGenerator = () => {
  const router = useRouter();
  const { userData, isAuthenticated } = useAuth();
  useEffect(() => {
    if (!userData && !isAuthenticated) {
        router.push("/login");
    }
    console.log(userData)
  }, [userData]);
  return (
    <LinearGradient
      colors={['#0097b2', '#7ed957']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      {/* Header with back button */}
      <View className="h-24 justify-center px-5 mt-5">
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => router.replace('./homepage')} className="bg-[#0f8799] p-1 rounded-3xl">
            <Entypo name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white">QR Code </Text>
        </View>
      </View>

      {/* QR Code container */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-2xl font-bold ml-3 ">Evacuee QR Code:</Text>
        <View className="bg-white p-5 rounded-xl shadow-lg mt-5">
          <QRCode 
            value={JSON.stringify(userData)} // Replace with your desired data
            size={250} // Adjust size as needed
            color="#0097b2" // Use primary theme color
            backgroundColor="white"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default QRCodeGenerator;

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Modal, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAuth } from "@/context/authContext";
import axios from "axios";

const QRScanner = () => {
  const router = useRouter();
  const { userData, isAuthenticated } = useAuth();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const { width } = Dimensions.get("window");
  const scannerSize = width * 0.9; // Adjust scanner size dynamically
  const [resources, setResources] = useState([]);
  const [showResourceInput, setShowResourceInput] = useState(false);
  const [resourceQuantities, setResourceQuantities] = useState({});
  const [assignedResourcesQuantities, setAssignedResourcesQuantities] = useState({});
  const [assignedResources, setAssignedResources] = useState([]);
  const [healthInfo, setHealthInfo] = useState({
    isWounded: false,
    woundDescription: '',
    isCritical: false,
    medicalNeeds: ''
  });
  
  // Function to handle quantity changes
  const handleQuantityChange = (resourceId, value) => {
    setResourceQuantities(prev => ({
      ...prev,
      [resourceId]: value
    }));
  };

  // Function to fetch assigned resources
  const getAssignedResources = async () => {
    try{
      const response = await axios.get(process.env.EXPO_PUBLIC_API_KEY + '/evacuees/evacuee/' + parsedData._id, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Assigned Resources:", response.data.assignments);
      setAssignedResources(response.data.assignments);
    }catch(error){
      console.error(error);
    }
  };

  useEffect(() => {
    if(parsedData){
      getAssignedResources();
    }
  }, [parsedData, scannedData]);

  const handleAddResources = async () => {
    try {
      setShowResourceInput(true);
    } catch (error) {
      console.log(error)
    }
  };

  const handleResourceSubmit = async () => {
    try {
      const resourcesAccepted = Object.entries(resourceQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([resourceId, quantity]) => ({
        resource: resourceId,
        quantity: Number(quantity)
      }));
  
      const postData = {
        evacuee: parsedData._id, 
        center: parsedData.centerID, 
        resourcesAccepted,
        health: healthInfo
      };
    
      const response = await axios.post(
        process.env.EXPO_PUBLIC_API_KEY + '/assignment/evacuees',
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      if(response.status !== 201) {
        throw new Error('Error saving resources');
      }
      setShowResourceInput(false);
      alert('Resources allocated successfully!');
    } catch (error) {
      console.error('Error saving resources:', error.message);
      alert('Error saving resources');
    }
  };

  // Authentication check
  useEffect(() => {
    if (!userData && !isAuthenticated) {
      router.push("/login");
    }
  }, [userData, isAuthenticated]);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data);
  };

  const getResources = async () => {
    try {
      const response = await axios.get(process.env.EXPO_PUBLIC_API_KEY + '/get-resources', {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error.message);
    }
  };

  useEffect(()=> {
    getResources();
  }, []);

  // Parse scanned data
  let parsedData = null;
  try {
    parsedData = scannedData ? JSON.parse(scannedData) : null;
  } catch (error) {
    console.log("Invalid QR code format", error);
  }

  if (hasPermission === null) {
    return (
      <LinearGradient
        colors={["#0097b2", "#7ed957"]}
        className="flex-1 justify-center items-center"
      >
        <Text className="text-white">Requesting camera permission...</Text>
      </LinearGradient>
    );
  }

  if (hasPermission === false) {
    return (
      <LinearGradient
        colors={["#0097b2", "#7ed957"]}
        className="flex-1 justify-center items-center"
      >
        <Text className="text-white">No access to camera.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#0097b2", "#7ed957"]} className="flex-1">
      {/* Header */}
      {scanned ?
        (<View className="h-24 justify-center px-5 mt-5">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => router.replace('./homepage')} className="bg-[#0f8799] p-1 rounded-3xl">
              <Entypo name="chevron-left" size={30} color="white" />
            </TouchableOpacity>
            <Text className="text-2xl font-semibold text-white"> QR Scanner </Text>
          </View>
        </View>)
        : null
      }

      {/* If scanned, show user data */}
      {scanned ? (
        <View className="flex-1 items-center p-2">
          <View className="bg-white w-11/12 max-w-4xl p-2 rounded-xl shadow-lg">
            {parsedData ? (
              <View className="bg-white rounded-xl p-2 shadow-md">
                <Text className="text-l font-bold text-center mb-4">User Information</Text>
                <View className="space-y-3">
                  {/* Display user data with more compact and structured styling */}
                  {[
                    { label: "Name", value: parsedData.name },
                    { label: "Username", value: parsedData.username },
                    { label: "Email", value: parsedData.contactInfo?.email },
                    { label: "Phone", value: parsedData.contactInfo?.phone },
                    { label: "Address", value: parsedData.address },
                    { label: "Center", value: parsedData.centerName },
                    { label: "Role", value: parsedData.role },
                    { label: "Head of Family", value: parsedData.additionalDetails.headOfFamilyName },
                    { label: "PWD Status", value: parsedData.additionalDetails.isPWD ? "Yes" : "No" },
                    { label: "PWD Type", value: parsedData.additionalDetails.pwdType === "none" ? "N/A" : parsedData.additionalDetails.pwdType }
                  ].map((item, index) => (
                    <View key={index} className="flex-row justify-between items-center border-b border-gray-300 pb-1">
                      <Text className="text-xs font-semibold">{item.label}:</Text>
                      <Text className="text-xs">{item.value}</Text>
                    </View>
                  ))}
                  <View className="mt-4">
                    <Text className="text-xs font-semibold mb-2">Assigned Resources:</Text>
                    {assignedResources && assignedResources.map((assignment) => (
                      <View key={assignment._id} className="mb-3">
                        {assignment.resourcesAccepted.map((resource) => (
                          <View key={resource._id} className="ml-2 mb-1">
                            <Text className="text-xs">
                              • {resource.resource?.name}:{" "}
                              <Text className="font-semibold">{resource.quantity} {resource.resource?.unit}</Text>
                            </Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
                
              </View>
            ) : (
              <Text className="text-xs text-red-500">Invalid QR Data</Text>
            )}
            <TouchableOpacity
                    className="my-2 bg-blue-500 rounded-md py-2 w-full items-center justify-center"
                    onPress={handleAddResources}
                  >
                    <Text className="text-white ">Add Resources</Text>
                  </TouchableOpacity>
            {/* Scan Again Button */}
            <TouchableOpacity
              onPress={() => {
                setScanned(false);
                setScannedData(null);
              }}
              className="bg-[#0097b2] py-2 px-4 rounded"
            >
              <Text className="text-white text-center">Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // If not scanned, show the camera
        
        <View className="flex-1  border border-red-500">
          
        <View className="flex-1 justify-center items-center">
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ width: 1000, height: 900 }}
          />
        </View>
        {scanned ?
        null
        : (<View className="h-24 justify-center px-5 mt-5 absolute items-center">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => router.replace('./homepage')} className="bg-[#0f8799] p-1 rounded-3xl">
              <Entypo name="chevron-left" size={30} color="white" />
            </TouchableOpacity>
            <Text className="text-2xl font-semibold text-white"> QR Scanner </Text>
          </View>
        </View>)
      }
      </View>
      )}
      <Modal
        visible={showResourceInput}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResourceInput(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-5 rounded-xl">
            <Text className="text-xl font-bold mb-4">Allocate Resources</Text>

            {resources.map(resource => (
              <View key={resource._id} className="mb-4">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-semibold">{resource.name}</Text>
                  <Text className={`text-xs ${resource.quantity === 0 ? 'text-red-500' : 'text-gray-600'}`}>
                    Available: {resource.quantity} {resource.unit}
                  </Text>
                </View>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  keyboardType="numeric"
                  placeholder={resource.quantity === 0 ? "Out of stock" : "Enter quantity"}
                  onChangeText={value => handleQuantityChange(resource._id, value)}
                  value={resourceQuantities[resource._id]?.toString() || ''}
                  editable={resource.quantity !== 0}
                />
              </View>
            ))}

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="bg-gray-300 px-6 py-2 rounded-lg"
                onPress={() => setShowResourceInput(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-6 py-2 rounded-lg"
                onPress={handleResourceSubmit}
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default QRScanner;

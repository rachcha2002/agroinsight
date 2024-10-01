import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { useRouter, usePathname } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import { images } from '../../constants';

const RotationModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const pathname = usePathname();
  const { user, setUser, setIsLogged } = useGlobalContext();

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/crop-rotator/model`);
      setModels(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchModels();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 ,backgroundColor:'#FFFFFF'}}>
      <SafeAreaView className="h-full">
        <View className="flex-1">
          <View className="justify-between items-center flex-row ">
            <View className="flex-1 items-center pl-7">
              <Image
                source={images.agroinsightlogo}
                className="w-15 h-10"
                resizeMode="contain"
              />
            </View>
          </View>
          
          <ScrollView
            className="p-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity  onPress={() => router.back()}> 
            <Image
              source={icons.leftArrow}
              className="w-50 h-15"
              resizeMode="contain"
            />
        </TouchableOpacity>
        <Text className="text-xl text-black font-semibold ml-4" style={{textAlign:'center'}}>General Crop Rotation Models</Text></View>
            {models.map((model) => (
                <View className="mt-2.5 mb-4 p-4 bg-white rounded-lg shadow" key={model.modelId}>
                  <Image
                    source={images.rotationimage}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                  <Text className="text-lg font-bold mt-4">Crop Rotation Model : {model.modelId}</Text>
                  <Text className="text-gray-700 mt-2">Zone : {model.zone}</Text>
                  <Text className="text-gray-700 mt-2">Season : {model.season}</Text>
                  <Text className="text-gray-700 mt-2">Year : {model.year}</Text>
                  <Text className="text-gray-700 mt-2">Suitable Crop : {model.crop}</Text>
                  <Text className="text-gray-700 mt-2">Climate Description of the zone : {model.climateDescription}</Text>
                  <Text className="text-gray-700 mt-2">Soil Description of the zone : {model.soilDescription}</Text>
                  <Text className="text-gray-700 mt-2">Climate Suitability for the crop : {model.climateSuitability}</Text>
                  <Text className="text-gray-700 mt-2">Soil Suitability for the crop : {model.soilSuitability}</Text>
                </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default RotationModels;

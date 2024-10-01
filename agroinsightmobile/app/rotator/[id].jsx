import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { icons, images } from "../../constants";
import { router } from "expo-router";

const RotatorDetails = () => {
  const { id } = useLocalSearchParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/crop-rotator/rotator-alerts/${id}`);
        setAlert(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlertDetails();
  }, [id]);

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
    <SafeAreaView className="bg-white h-full">
    <View className="flex-1 px-4 items-center">
      <View className="justify-between items-center flex-row">
       <View className="items-center pl-3 mt-2">
          <Image
            source={images.agroinsightlogo}
            className="w-15 h-10"
            resizeMode="contain"
          />
        </View>
        </View>
      {alert && (
        <>
      <View style={{ flexDirection: 'row',  alignItems: 'center' }}>
      <TouchableOpacity  onPress={() => router.back()}> 
            <Image
              source={icons.leftArrow}
              className="w-50 h-15"
              resizeMode="contain"
            />
        </TouchableOpacity>
        <Text className="text-2xl text-black font-semibold ml-4 ">{alert.title}</Text>
       </View>
          <Image
            source={{ uri: alert.imageURL }}
            className="mt-4 w-full h-48 rounded-lg"
            resizeMode="cover"
          />
          <Text className="text-gray-700 mt-2">{alert.zone}</Text>
          <Text className="text-gray-700 mt-2">{alert.description}</Text>
          {alert.details && (
            <Text className="text-gray-700 mt-4">
              <Text className="font-bold">Details : </Text>
              {alert.details}
            </Text>
          )}
          <Text className="text-gray-500 mt-2">Date: {new Date(alert.date).toLocaleDateString()}</Text>
        </>
      )}
    </View>
    </SafeAreaView>
  );
};

export default RotatorDetails;

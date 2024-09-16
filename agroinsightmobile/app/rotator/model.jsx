import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { images } from '../../constants';


const ModelDetails = () => {
  const { modelid } = useLocalSearchParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/crop-rotator/model/${id}`);
        setModel(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModelDetails();
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
    <View className="flex-1 p-4 items-center justify-center">
       {model.map(model => (
        <>
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
        </>
         ))}
    </View>
  );
};

export default ModelDetails;

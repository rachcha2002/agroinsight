import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";

const DiseaseDetails = () => {
  const { id } = useLocalSearchParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/disease/disease-alerts/${id}`
        );

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
    <View className="flex-1 p-4 items-center justify-center">
      {alert && (
        <>
          <Image
            source={{ uri: alert.imageURL }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
          />
          <Text className="text-xl font-bold mt-4">{alert.title}</Text>
          <Text className="text-gray-700 mt-2">{alert.description}</Text>
          <Text className="text-gray-500 mt-2">
            Date: {new Date(alert.date).toLocaleDateString()}
          </Text>
          {alert.details && (
            <Text className="text-gray-700 mt-4">
              <Text className="font-bold">Details: </Text>
              {alert.details}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default DiseaseDetails;

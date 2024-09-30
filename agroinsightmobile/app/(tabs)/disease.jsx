import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { useRouter, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";

const DiseaseDashboard = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchAlerts = async () => {
    try {

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/disease/disease-alerts`
      );


      setAlerts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAlertPress = (id) => {
    router.push(`/disease/${id}`);
  };

  const handleComplaintPress = () => {
    router.push("/disease/complaints"); // Navigate to the create complaint screen
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
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
            <View className="mt-1.5">
              <TouchableOpacity onPress={handleComplaintPress}>
                <Image
                  source={images.complaint}
                  className="w-10 h-11"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className="p-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {alerts.map((alert) => (
              <TouchableOpacity
                key={alert._id}
                onPress={() => handleAlertPress(alert._id)}
              >
                <View className="mb-4 p-4 bg-white rounded-lg shadow">
                  <Image
                    source={{ uri: alert.imageURL }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                  <Text className="text-lg font-bold mt-4">{alert.title}</Text>
                  <Text className="text-gray-700 mt-2">
                    {alert.description}
                  </Text>
                  <Text className="text-gray-500 mt-2">
                    Date: {new Date(alert.date).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DiseaseDashboard;

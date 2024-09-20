import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { useRouter, usePathname } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';

const RotatorDashboard = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const pathname = usePathname();

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/crop-rotator/rotator-alerts`);
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
    router.push(`/rotator/${id}`);
  };

  const handleRotatorModelPress = () => {
    router.push('/rotator/farmerdetails'); // Navigate to the create complaint screen
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
    <GestureHandlerRootView style={{ flex: 1 ,backgroundColor:'#FFFFFF'}}>
      <SafeAreaView className="h-full">
        <View className="flex-1">
          <View className="justify-between items-center flex-row ">
            <View className="flex-1 items-center pl-7">
              <Image
                source={images.agroinsightlogo}
                className="w-15 h-10 ml-8"
                resizeMode="contain"
              />
            </View>
            <View className="mr-1.5">
              <TouchableOpacity onPress={handleRotatorModelPress}>
                <Image
                  source={images.complaint}
                  className="w-10 h-11"
                  resizeMode="contain"
                />
                <Text className="text-xs text-black font-semibold">Details</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView
            className="p-3"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
        <Text className="text-2xl text-black font-semibold" style={{textAlign:'center'}}>Crop Rotation Newsfeed</Text>
            {alerts.map(alert => (
              <TouchableOpacity key={alert._id} onPress={() => handleAlertPress(alert._id)}>
                <View className="mt-4 mb-4 p-4 bg-white rounded-lg shadow">
                  <Image
                    source={{ uri: alert.imageURL }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                  <Text className="text-lg font-bold mt-4">{alert.title}</Text>
                  <Text className="text-gray-700 mt-2">{alert.zone}</Text>
                  <Text className="text-gray-700 mt-2">{alert.description}</Text>
                  <Text className="text-gray-500 mt-2">Date: {new Date(alert.date).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default RotatorDashboard;

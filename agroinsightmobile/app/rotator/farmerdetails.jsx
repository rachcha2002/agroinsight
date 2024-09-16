import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from "react-native";

import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";

function FarmerDetails() {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/crop-rotator/rotator-detail`);
      setDetails(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Details",
      "Are you sure you want to delete this details?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/crop-rotator/rotator-detail/${id}`
              );

              if (response.status === 200) {
                setDetails(
                  details.filter((detail) => detail._id !== id)
                );
                Alert.alert("Success", "Details deleted successfully.");
              } else {
                Alert.alert("Error", "Failed to delete the detail.");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete the detail.");
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDetails();
    setRefreshing(false);
  };

  const handleRotationModelPress = () => {
    router.push('/rotator/rotationmodels'); // Navigate to the create complaint screen
  };

  const handleRotationDetailsPress = () => {
    router.push('/rotator/details'); // Navigate to the create complaint screen
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

const renderItem = ({ item }) => (
  <View className="mb-6 p-2 bg-white rounded-lg shadow border border-green-600">
      <Text className="text-xl text-black font-semibold px-3 my-4">Personalized Recommendations</Text>
       <FormField
        title="Farming Season"
        value={item.season}
        //handleChangeText={(e) => setForm({ ...form, symptoms: e })}
        textClass="text-black"
        placeholderTextColor="gray"
      />

      <FormField
        title="Current Farming Crop"
        value={item.currentCrop}
       // handleChangeText={(e) => setForm({ ...form, cropAffected: e })}
        textClass="text-black"
        placeholderTextColor="gray"
      />

      <FormField
        title="Farming Status"
        value={item.status}
       // handleChangeText={(e) => setForm({ ...form, cropAffected: e })}
        textClass="text-black"
        placeholderTextColor="gray"
      />

      <FormField
        title="Recommended Crop for Next Season"
        value={item.recommendedCrop}
       // handleChangeText={(e) => setForm({ ...form, cropAffected: e })}
        textClass="text-black"
        placeholderTextColor="gray"
      />
    
       {/* Delete Button */}
       <TouchableOpacity
        className="mt-4 bg-red-500 p-3 rounded-lg"
        onPress={() => handleDelete(item._id)}
      >
        <Text className="text-white text-center font-bold">
          Remove Details
        </Text>
      </TouchableOpacity>
      </View>
    );
    

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="justify-between items-center flex-row ">
        <View className="flex-1 items-center pl-4">
          <Image
            source={images.agroinsightlogo}
            className="w-15 h-10"
            resizeMode="contain"
          />
        </View>
      </View>
        <Text className="text-2xl text-black font-semibold ml-2.5">Crop Rotation Details</Text>
        <View className="mt-2.5 items-center">
          <TouchableOpacity onPress={handleRotationDetailsPress}>
            <Image
              source={images.rotationdetails}
              className="w-50 h-15"
              resizeMode="contain"
            />
            <Text className="text-l text-black font-semibold text-center">Add Crop Rotation Details</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-2.5 items-center">
          <TouchableOpacity onPress={handleRotationModelPress}>
            <Image
              source={images.rotationicon}
              className="w-50 h-15"
              resizeMode="contain"
            />
            <Text className="text-l text-black font-semibold text-center">See Recommended Crop Rotation Models</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={details}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 16 }}
        />
    </SafeAreaView>
  );
}

export default FarmerDetails;
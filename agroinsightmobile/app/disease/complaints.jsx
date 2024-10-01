import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DiseaseHeader from "../../components/disease-Management/DeseaseHeader";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

const Complaints = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useGlobalContext();

  const fetchComplaints = async (email) => {
    setLoading(true);
    setError(null); // Clear previous errors before fetching
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/disease/complaints/farmer/${email}`
      );

      // Sort the complaints by dateOfComplaint in descending order
      const sortedComplaints = response.data.sort(
        (a, b) => new Date(b.dateOfComplaint) - new Date(a.dateOfComplaint)
      );

      setComplaints(sortedComplaints);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // If the status code is 404, it means no complaints were found
        setComplaints([]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchComplaints(user.email);
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.email) {
      await fetchComplaints(user.email);
    }
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Complaint",
      "Are you sure you want to delete this complaint?",
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
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/disease/complaints/${id}`
              );

              if (response.status === 200) {
                setComplaints(
                  complaints.filter((complaint) => complaint._id !== id)
                );
                Alert.alert("Success", "Complaint deleted successfully.");
              } else {
                Alert.alert("Error", "Failed to delete the complaint.");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete the complaint.");
            }
          },
        },
      ]
    );
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

  if (!loading && complaints.length === 0) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <SafeAreaView className="h-full">
          <DiseaseHeader />

          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg mb-4">
              No Complaints Found
            </Text>
            <TouchableOpacity
              className="bg-green-500 p-3 rounded-lg"
              onPress={() => router.push("/disease/createcomplaint")} // Adjust to match your create complaint screen name
            >
              <Text className="text-white text-center font-bold">
                Create Complaint
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  const renderItem = ({ item }) => (
    <View className="mb-6 p-2 bg-white rounded-lg shadow border border-green-600">
      <View className="mt-0.1">
        <Text className="text-lg font-bold text-center mb-2">
          {item.cropAffected}
        </Text>
      </View>
      {item.imageURL && (
        <Image
          source={{ uri: item.imageURL }}
          className="w-full h-48 rounded-lg"
          resizeMode="cover"
        />
      )}
      <View className="mt-2">
        <Text className="text-gray-700">
          <Text className="font-bold">Area: </Text>
          {item.area}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-gray-700">
          <Text className="font-bold">Complaint: </Text>
          {item.complaintDescription}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-gray-700">
          <Text className="font-bold">Disease Status: </Text>
          {item.diseaseStatus}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-gray-700">
          <Text className="font-bold">Control Method: </Text>
          {item.controlMethod}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-gray-700">
          <Text className="font-bold">Solution: </Text>
          {item.solution}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-gray-700">
          <Text className="font-bold">Officer Remarks: </Text>
          {item.officerRemarks}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-gray-700">
          <Text className="font-bold">Date: </Text>
          {new Date(item.dateOfComplaint).toLocaleDateString()}
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        className="mt-4 bg-red-500 p-2 rounded-lg"
        onPress={() => handleDelete(item._id)}
      >
        <Text className="text-white text-center font-bold">
          Delete Complaint
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView className="h-full">
        <DiseaseHeader />
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 16 }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Complaints;

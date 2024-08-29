import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useRouter, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";

const AgrochemicalsDashboard = () => {
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
        "http://192.168.1.167:5000/api/disease/disease-alerts"
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
          </View>

          <View className="mb-4 p-4 bg-white rounded-lg shadow">
            <View className="relative">
              <Image
                source={images.sprayingpesticides}
                className="w-full h-60 rounded-lg" // Adjusted height
                resizeMode="cover"
              />
              {/* Overlay to darken the image */}
              <View className="absolute inset-0 bg-black opacity-40 rounded-lg" />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%", // Makes the View the same width as the image
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with 80% opacity
                  padding: 8,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <Text className="text-white text-4xl font-bold">
                  Agrochemicals
                </Text>
                <Text className="text-white text-xl font-bold">
                  About fertilizers and pesticides
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <TouchableOpacity
              style={styles.card}
              //onPress={() => navigation.navigate('WhatsNew')}
            >
              <Image source={images.sprayingpesticides} style={styles.icon} />
              <Text style={styles.cardTitle}>What's New?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              //onPress={() => navigation.navigate('MyAgrochemicals')}
            >
              <Image source={images.sprayingpesticides} style={styles.icon} />
              <Text style={styles.cardTitle}>My Agrochemicals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              //onPress={() => navigation.navigate('FertilizerRecommendations')}
            >
              <Image source={images.sprayingpesticides} style={styles.icon} />
              <Text style={styles.cardTitle}>Fertilizer Recommendations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              //onPress={() => navigation.navigate('PesticideRecommendations')}
            >
              <Image source={images.sprayingpesticides} style={styles.icon} />
              <Text style={styles.cardTitle}>Pesticide Recommendations</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-around",
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default AgrochemicalsDashboard;

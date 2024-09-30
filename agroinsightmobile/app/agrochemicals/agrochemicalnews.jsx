import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Button,
} from "react-native";
import axios from "axios";
import { useRouter, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons from react-native-vector-icons

const AgrochemicalNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/news`
      );
      setNews(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleShowDetails = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/f&p/news/${id}`
      );
      setSelectedNews(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching news details:", err.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <View>
            {/* Back button with Ionicons */}
            <TouchableOpacity
              onPress={() => router.back()} // Use router.back() for back functionality
              style={styles.backButton} // Apply styles correctly
              activeOpacity={0.7} // Add an activeOpacity to give visual feedback on press
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          {/* Logo in the center */}
          <View style={styles.logoContainer}>
            <Image
              source={images.agroinsightlogo} // Use the correct path for the image
              //style={styles.logo}
              resizeMode="contain"
              className="w-15 h-12"
            />
          </View>
        </View>
        <Text className="text-black text-2xl font-bold ml-2 mt-4 ml-4">
          What new about Agrochemicals?
        </Text>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ padding: 10 }}>
            {news.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => handleShowDetails(item._id)}
              >
                <View
                  style={{
                    marginBottom: 20,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    padding: 10,
                  }}
                >
                  <Image
                    source={{ uri: item.imageURL }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {item.title}
                  </Text>
                  <Text>{item.description}</Text>
                  <Text style={{ color: "#888", marginTop: 5 }}>
                    Date: {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Modal for displaying news details */}
        {showModal && (
          <Modal transparent={true} visible={showModal} animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  width: "90%",
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  position: "relative", // Needed to position the close button
                }}
              >
                {selectedNews && (
                  <>
                    {/* Close button in the top-right corner */}
                    <TouchableOpacity
                      onPress={() => setShowModal(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>

                    <Image
                      source={{ uri: selectedNews.imageURL }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        marginBottom: 10,
                        marginTop: 10, // Adjust as needed
                      }}
                      resizeMode="cover"
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      {selectedNews.title}
                    </Text>
                    <Text style={{ marginBottom: 10 }}>
                      {selectedNews.description}
                    </Text>
                    <Text style={{ marginBottom: 10 }}>
                      Additional Details: {selectedNews.details}
                    </Text>
                    <Text style={{ marginBottom: 10 }}>
                      Source: {selectedNews.source}
                    </Text>
                    <Text style={{ marginBottom: 10 }}>
                      Date: {new Date(selectedNews.date).toLocaleDateString()}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = {
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingLeft: 15, // Adjust padding as needed
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 40,
  },
  closeButton: {
    position: "absolute", // Absolute positioning to place it at the top-right
    top: 5,
    right: 10,
    zIndex: 1, // Ensures it's on top of other elements
    //backgroundColor: "rgba(0, 0, 0, 0.5)", // Black background with 0.5 opacity
    padding: 3, // Adjust padding for better touch area
    //borderRadius: 20, // Rounded edges for the close button
  },
};

export default AgrochemicalNews;

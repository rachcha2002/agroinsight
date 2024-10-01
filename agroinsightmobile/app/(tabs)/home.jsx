import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import { useRouter } from "expo-router";

const Home = () => {
  const { user } = useGlobalContext();
  const router = useRouter();

  const cards = [
    { id: "disease/complaints", name: "Report Desease", image: images.pdcard },
    { id: "market", name: "Market Trends", image: images.marketcard },
    {
      id: "agrochemicals/agrochemicalnews",
      name: "Agrochemicals News",
      image: images.agrochemcard,
    },
    {
      id: "rotator",
      name: "Crop Rotation Alerts",
      image: images.cropcard,
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white h-full">
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="mt-2 px-2 space-y-6">
            <View className="justify-between items-start flex-row mb-2">
              <View className="flex flex-row">
                <View className="mt-1.5">
                  <Image
                    source={images.agrominilogo}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text className="font-pmedium text-sm text-black">
                    Welcome Back,
                  </Text>
                  <Text className="text-2xl font-psemibold text-green-900">
                    {user?.name}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  router.push("/profile");
                }}
              >
                <Image
                  source={{ uri: user?.imageUrl }}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            className="m-4  bg-white rounded-lg"
            style={{
              elevation: 10, // Android shadow
              shadowColor: "#000", // iOS shadow color
              shadowOffset: { width: 0, height: 4 }, // iOS shadow offset
              shadowOpacity: 0.5, // iOS shadow opacity
              shadowRadius: 4.65, // iOS shadow radius
            }}
          >
            <View className="relative">
              <Image
                source={images.homecard}
                className="w-full h-80 rounded-lg" // Adjusted height
                resizeMode="cover"
              />
              {/* Overlay to darken the image */}
              <View className="absolute inset-0 bg-black opacity-40 rounded-lg" />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "45%", // Makes the View the same width as the image
                  backgroundColor: "rgba(0, 0, 0, 0.7)", // Black with 80% opacity
                  padding: 5,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderRadius: 8,
                }}
              >
                <Text className="text-white text-2xl font-bold">
                  Agro Insight
                </Text>
                <Text className="text-white text-lg">
                  Optimize the value of Sri Lankan farmers' work with technology
                  for better yields and sustainable growth.
                </Text>
              </View>
            </View>
          </View>
          <Text className="text-black text-lg font-bold ml-4 mt-4">
            Trending Features
          </Text>
          <View className="flex flex-row flex-wrap justify-between ml-4 mr-4 mt-2">
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                className="w-[48%] h-40" // Takes 48% of the width for two cards per row
                onPress={() => router.push(`/${card.id}`)} // Navigate to details on press
              >
                <View
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  style={{
                    elevation: 10, // Android shadow
                    shadowColor: "#000", // iOS shadow color
                    shadowOffset: { width: 0, height: 8 }, // iOS shadow offset
                    shadowOpacity: 0.5, // iOS shadow opacity
                    shadowRadius: 4.65, // iOS shadow radius
                  }}
                >
                  <Image
                    source={card.image}
                    className="w-full h-24" // Full width with height of 160 (adjust as necessary)
                    resizeMode="cover"
                  />
                  <Text className="text-center text-lg font-bold py-2">
                    {card.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;

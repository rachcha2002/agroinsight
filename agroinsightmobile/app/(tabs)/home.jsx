import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";

const Home = () => {
  const { user } = useGlobalContext();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white h-full">
      <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-black">
                    Welcome Back,
                  </Text>
                  <Text className="text-2xl font-psemibold text-green-900">
                    {user?.name}
                  </Text>
                </View>
                <View className="mt-1.5">
                  <Image
                    source={images.agrominilogo}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </View>
              </View>
              </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;

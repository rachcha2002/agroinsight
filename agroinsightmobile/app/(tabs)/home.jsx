import { View, Text, FlatList, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { RefreshControl } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getAllPosts, getLastestPosts } from "../../lib/appwrite";
import useAppWrite from "../../lib/useAppWrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch } = useAppWrite(getAllPosts);
  const { data: lastestPosts } = useAppWrite(getLastestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();

    setRefreshing(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white h-full">
        <FlatList
          data={posts}
          //data={[]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item ?? []} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 14,
                      color: "#000",
                    }}
                  >
                    Welcome Back,
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      fontSize: 24,
                      color: "#000",
                    }}
                  >
                    {user?.username}
                  </Text>
                </View>
                <View style={{ marginTop: 6, marginLeft: 4 }}>
                  <Image
                    source={images.agroinsightlogo}
                    style={{ width: 200, height: 140 }} // Set width and height correctly
                    resizeMode="contain"
                  />
                </View>
              </View>
              <SearchInput />
              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-gray-100  text-lg font-pregular  mb-3">
                  Lastest Videos
                </Text>

                <Trending posts={lastestPosts ?? []} />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="Be the first to create a video"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;

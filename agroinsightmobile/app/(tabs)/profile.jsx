import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, TouchableOpacity, Text, Alert ,Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage to handle session
import { useGlobalContext } from "../../context/GlobalProvider"; // Use the context to access user state
import { icons } from "../../constants"; 
import InfoBox from "../../components/InfoBox";// Import icons

const Profile = () => {
  const { setUser,user } = useGlobalContext(); // Access the setUser function to update the state

  // Handle logout
  const handleLogout = async () => {
    try {
      // Remove the session from AsyncStorage
      await AsyncStorage.removeItem("userSession");

      // Clear the user state
      setUser(null);

      // Redirect to the root (login) page
      router.push("/");
    } catch (error) {
      Alert.alert("Logout failed", "An error occurred while logging out.");
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={handleLogout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logoutgreen}
                resizeMode="contain"
                className="w-7 h-7"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-green-950 rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.imageUrl }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.name}
              subtitle={user?.email}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

           
          </View>

      <View className="flex-1 justify-center items-center">
        <Text className="text-xl text-green-800 font-bold mb-4">This is the profile page</Text>
        
       
      </View>
    </SafeAreaView>
  );
};

export default Profile;

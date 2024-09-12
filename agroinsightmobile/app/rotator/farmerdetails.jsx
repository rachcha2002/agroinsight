import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";
import { uploadDiseaseData } from "../../lib/diseaseAPI"; // Adjust the path as needed

function FarmerDetails() {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
 

  const onRefresh = async () => {
    setRefreshing(true);
   // await fetchAlerts();
    setRefreshing(false);
  };

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
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-black font-semibold">Farmer Details</Text>
        <FormField
          title="Name"
          //value={form.cropAffected}
          placeholder="your name"
         // handleChangeText={(e) => setForm({ ...form, cropAffected: e })}
          otherStyles="mt-5"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Farming Region/Zone"
          //value={form.symptoms}
          placeholder="Dry / Wet / Intermediate..."
          //handleChangeText={(e) => setForm({ ...form, symptoms: e })}
          otherStyles="mt-10"
          textClass="text-black"
          placeholderTextColor="gray"
        />

         <FormField
          title="Farming Season"
          //value={form.symptoms}
          placeholder="Yala season / Maha season / Not specified..."
          //handleChangeText={(e) => setForm({ ...form, symptoms: e })}
          otherStyles="mt-10"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Farming Years"
          //value={form.symptoms}
          placeholder="For how many years you are farming?"
          //handleChangeText={(e) => setForm({ ...form, symptoms: e })}
          otherStyles="mt-10"
          textClass="text-black"
          placeholderTextColor="gray"
        />
      
        <CustomButton
          title="Submit"
          //handlePress={submit}
          containerStyles="mt-7 bg-green-500"
          textClass="text-white"
          //isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default FarmerDetails;
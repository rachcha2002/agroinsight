import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";

import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";
import { uploadRotatorDetails} from "../../lib/rotationAPI";

function RotationDetails() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    season: "",
    currentCrop: "",  
    status: "",
  });

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

  const submit = () => {
    uploadRotatorDetails(form, setUploading, setForm);
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity  onPress={() => router.back()}> 
            <Image
              source={icons.leftArrow}
              className="w-50 h-15"
              resizeMode="contain"
            />
        </TouchableOpacity>
        <Text className="text-2xl text-black font-semibold ml-4">Crop Rotation Details</Text>
       </View>
         <FormField
          title="Farming Season"
          value={form.season}
          placeholder="Yala season / Maha season / Not specified..."
          handleChangeText={(e) => setForm({ ...form, season: e })}
          otherStyles="mt-10"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Current Farming Crop"
          value={form.currentCrop}
          placeholder="current crop cultivating"
          handleChangeText={(e) => setForm({ ...form, currentCrop: e })}
          otherStyles="mt-5"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Farming Status"
          value={form.status}
          placeholder="Started / Pending / Completed"
          handleChangeText={(e) => setForm({ ...form, status: e })}
          otherStyles="mt-5"
          textClass="text-black"
          placeholderTextColor="gray"
        />
      
        <CustomButton
          title="Add Details"
          handlePress={submit}
          containerStyles="mt-7 bg-green-500"
          textClass="text-white"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default RotationDetails;
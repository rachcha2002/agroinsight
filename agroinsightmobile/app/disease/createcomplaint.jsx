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

const CreateComplaint = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    symptoms: "",
    cropAffected: "",  // Add cropAffected to the form state
    diseaseImage: null,
  });

  // Function to open the image picker and set the selected image in form state
  const openPicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        diseaseImage: result.assets[0],
      });
    } else {
      setTimeout(() => {
        Alert.alert("Image picking failed", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = () => {
    uploadDiseaseData(form, setUploading, setForm, user);
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
        <Text className="text-2xl text-black font-semibold">Report new pest or disease</Text>
        <FormField
          title="Crop Affected"
          value={form.cropAffected}
          placeholder="What crop is affected?"
          handleChangeText={(e) => setForm({ ...form, cropAffected: e })}
          otherStyles="mt-5"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Symptoms"
          value={form.symptoms}
          placeholder="Describe the symptoms..."
          handleChangeText={(e) => setForm({ ...form, symptoms: e })}
          otherStyles="mt-10"
          textClass="text-black"
          placeholderTextColor="gray"
        />
      

        <View className="mt-7 space-y-2">
          <Text className="text-base text-black font-medium">Disease Image</Text>

          <TouchableOpacity onPress={openPicker}>
            {form.diseaseImage ? (
              <Image
                source={{ uri: form.diseaseImage.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-gray-200 rounded-2xl border-2 border-gray-300 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-500 font-medium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Report"
          handlePress={submit}
          containerStyles="mt-7 bg-green-500"
          textClass="text-white"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateComplaint;

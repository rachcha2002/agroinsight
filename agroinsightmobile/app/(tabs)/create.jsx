import { useState } from "react";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { icons } from "../../constants";
// import { createDiseaseEntry } from "../../lib/api"; // Commenting out the backend import

import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    cropName: "",
    diseaseName: "",
    symptoms: "",
    treatment: "",
    diseaseImage: null,
  });

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg"],
    });

    if (!result.canceled) {
      setForm({
        ...form,
        diseaseImage: result.assets[0],
      });
    } else {
      setTimeout(() => {
        Alert.alert("Document picking failed", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      (form.cropName === "") |
      (form.diseaseName === "") |
      (form.symptoms === "") |
      (form.treatment === "") |
      !form.diseaseImage
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      // Commenting out backend interaction for now
      // await createDiseaseEntry({
      //   ...form,
      //   userId: user.$id,
      // });

      Alert.alert("Success", "This is a UI test. No data was uploaded.");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "This is a UI test. No backend interaction.");
    } finally {
      setForm({
        cropName: "",
        diseaseName: "",
        symptoms: "",
        treatment: "",
        diseaseImage: null,
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-black font-semibold">Upload Crop Disease Data</Text>

        <FormField
          title="Crop Name"
          value={form.cropName}
          placeholder="Enter the name of the crop..."
          handleChangeText={(e) => setForm({ ...form, cropName: e })}
          otherStyles="mt-10"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Disease Name"
          value={form.diseaseName}
          placeholder="Enter the name of the disease..."
          handleChangeText={(e) => setForm({ ...form, diseaseName: e })}
          otherStyles="mt-7"
          textClass="text-black"
          placeholderTextColor="gray"
        />

        <FormField
          title="Symptoms"
          value={form.symptoms}
          placeholder="Describe the symptoms..."
          handleChangeText={(e) => setForm({ ...form, symptoms: e })}
          otherStyles="mt-7"
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
          title="Submit"
          handlePress={submit}
          containerStyles="mt-7 bg-green-500"
          textClass="text-white"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

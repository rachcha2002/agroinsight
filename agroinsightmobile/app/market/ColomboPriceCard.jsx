import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import axios from "axios";
// import { generatePDF } from "./pdfHelper";

function ColomboPriceCard() {
  const [Crops, setCrops] = useState([]);
  const [searchCrop, setSearchCrop] = useState("");
  useEffect(() => {
    async function getCrops() {
      try {
        const res = await axios.get(`http://192.168.193.59:5000/crop/croplist`);
        const filteredCrops = res.data.filter((crop) => crop.Market === "Colombo");
        setCrops(filteredCrops);
      } catch (err) {
        console.error(err);
      }
    }
    getCrops();
  }, []);

  const filteredCrops = Crops.filter((Crop) =>
    Crop.Crop_name.toLowerCase().includes(searchCrop.toLowerCase())
  );

  return (
    <ScrollView className="p-5">
      <View className="mb-5">
        <TextInput
          className="border border-gray-400 p-3 mb-4"
          placeholder="Search Crop"
          value={searchCrop}
          onChangeText={setSearchCrop}
        />
        <TouchableOpacity onPress={() => setSearchCrop("")}>
          <Text className="text-blue-500 mb-4">Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => "generatePDF(Crops)"}>
          <Text className="text-red-500">Generate PDF</Text>
        </TouchableOpacity>
      </View>

      {filteredCrops.map((Crop) => (
        <View key={Crop._id} className="my-5 items-center">
          <Image source={{ uri: Crop.image }} className="w-48 h-48" />
          <Text className="text-lg font-bold">{Crop.Crop_name}</Text>
          <Text className="text-md">Price Per 1kg: Rs. {Crop.Price}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default ColomboPriceCard;

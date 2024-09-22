import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ImageBackground,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { images } from "../../constants";
import axios from "axios";
import moment from "moment";
import { useRouter } from "expo-router";

const Market = () => {
  const [highestPriceCrop, setHighestPriceCrop] = useState(null);
  const [highestThisWeek, setHighestThisWeek] = useState(null);
  const router = useRouter();


  useEffect(() => {
    function getCrops() {
      axios
        .get(`http://192.168.8.183:5000/crop/croplist`)
        .then((res) => {
          const crops = res.data;
          if (crops.length > 0) {
            const highestCrop = crops.reduce((prev, current) => {
              return prev.Price > current.Price ? prev : current;
            });
            setHighestPriceCrop(highestCrop);
          }
        })
        .catch((err) => {
          alert("Error fetching crops");
        });
    }
    getCrops();
  }, []);

  useEffect(() => {
    function getCrophistory() {
      axios
        .get(`http://192.168.8.183:5000/crop/gethistory`)
        .then((res) => {
          const filteredCrops = res.data;
          const today = moment();
          const weekStart = today.subtract(7, "days");

          const thisWeekCrops = filteredCrops.filter((crop) =>
            moment(crop.date, "DD/MM/YYYY").isSameOrAfter(weekStart)
          );

          if (thisWeekCrops.length > 0) {
            const highestCropThisWeek = thisWeekCrops.reduce(
              (prev, current) => {
                return prev.Price > current.Price ? prev : current;
              }
            );
            setHighestThisWeek(highestCropThisWeek);
          }
        })
        .catch((err) => {
          alert("Error fetching crop history");
        });
    }
    getCrophistory();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView className="h-full">
        <View style={styles.headerContainer}>
          <Image
            source={images.agroinsightlogo}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>Market Trends</Text>
        </View>
          
        <View style={styles.container}>
        <View style={styles.card}>
          {highestPriceCrop && (
            <View>
              <Text style={styles.cardTitle}>Today Market Trend</Text>
              <Text style={styles.cardText}>
                {highestPriceCrop.Crop_name}{"\n"}Rs.{highestPriceCrop.Price}.00 per 1kg
              </Text>
            </View>
          )}

          {highestThisWeek && (
            <View>
              <Text style={styles.cardTitle}>This Week Market Trend</Text>
              <Text style={styles.cardText}>
                {highestThisWeek.Crop_name}{"\n"}Rs.{highestThisWeek.Price}.00 per 1kg
              </Text>
            </View>
          )}
          </View>

          <View style={styles.pcontainer}>
          <TouchableOpacity style={styles.pcard} 
           onPress={() => router.push("/market/dailyprice")}>
            <ImageBackground
              source={images.dailyprice}
              style={styles.pcardImage}
              resizeMode="cover"
            >
              <View style={styles.ptextContainer}>
                <Text style={styles.pcardTitle}>Daily Market{"\n"} Price</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pcard}
           onPress={() => router.push("/market/pricehistory")}>
            <ImageBackground
              source={images.pricehistory}
              style={styles.pcardImage}
              resizeMode="cover"
            >
              <View style={styles.ptextContainer}>
                <Text style={styles.pcardTitle}>Price{"\n"} History</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: -10,
    marginLeft:10,
    flex: 0.12,
    flexDirection: "row",
    alignItems: "center",

  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  headerText: {
    marginLeft:15,
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    width: "95%",
    marginHorizontal: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#387F39",
    borderRadius: 10,
    marginTop:10,
    marginBottom: 20,
    padding: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 190,
  },
  textContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
  },
  cardTitle: {
    marginTop:10,
    fontSize: 30,
    textAlign:"center",
    fontWeight: "bold",
    color: "#fff",
  },
  cardText: {
    fontSize: 22,
    textAlign:"center",
    color: "#fff",
  },
  pcontainer: {
    flex: 1,
    width: "98%",
    marginTop: 20,
    marginHorizontal:5
  },
  pcard: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pcardImage: {
    width: "100%",
    height: 190,
  },
  ptextContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
  },
  pcardTitle: {
    height:"100%",
    fontSize: 57,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Market;

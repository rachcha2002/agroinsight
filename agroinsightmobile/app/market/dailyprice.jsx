import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { styled } from "nativewind";
import ColomboPriceCard from "./ColomboPriceCard";
import DambullaPriceCard from "./DambullaPriceCard";
import JaffnaPriceCard from "./JaffnaPriceCard";
import GallePriceCard from "./GallePriceCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import { images } from "../../constants";
import { useRouter } from "expo-router";

const Tab = createMaterialTopTabNavigator();
const StyledTabBar = styled(Tab.Navigator);

function Crops() {
  const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.push("/market")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={images.agroinsightlogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <StyledTabBar
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, color: "white" },
            tabBarStyle: { backgroundColor: "#387F39" },
            tabBarIndicatorStyle: {
              backgroundColor: "#4CAF50",
              height: "100%",
              borderRadius: 5,
            },
          }}
        >
          <Tab.Screen name="Colombo" component={ColomboPriceCard} />
          <Tab.Screen name="Dambulla" component={DambullaPriceCard} />
          <Tab.Screen name="Jaffna" component={JaffnaPriceCard} />
          <Tab.Screen name="Galle" component={GallePriceCard} />
        </StyledTabBar>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = {
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    marginLeft: 110,
  },
  logo: {
    width: 150,
    height: 40,
  },
};

export default Crops;

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ColomboPriceCard from "./ColomboPriceCard";
// import DambullaPriceCard from "./DambullaPriceCard";
// import JaffnaPriceCard from "./JaffnaPriceCard";
// import GallePriceCard from "./GallePriceCard";

const Tab = createBottomTabNavigator();

function Crops() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Colombo" component={ColomboPriceCard} />
      {/* <Tab.Screen name="Dambulla" component={DambullaPriceCard} />
      <Tab.Screen name="Jaffna" component={JaffnaPriceCard} />
      <Tab.Screen name="Galle" component={GallePriceCard} /> */}
    </Tab.Navigator>
  );
}

export default Crops;

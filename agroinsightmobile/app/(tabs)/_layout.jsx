import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        style={{ tintColor: color }}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-semibold" : "font-regular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 84, // Increase the height of the tab bar
          paddingBottom: 10, // Adjust padding as needed
          paddingTop: 10, // Adjust padding as needed
          backgroundColor: "#ffffff", // White background for the tab bar
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0", // Light gray border color
        },
        tabBarActiveTintColor: "#32CD32", // Green color for active tab icons and text
        tabBarInactiveTintColor: "#000000", // Black color for inactive tab icons and text
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="rotator"
        options={{
          title: "rotator",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.rotator}
              color={color}
              name="Crop Rotator"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="disease"
        options={{
          title: "disease",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.diesease}
              color={color}
              name="Disease"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="agrochemicals"
        options={{
          title: "agrochemicals",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.fertilizer}
              color={color}
              name="Agrochemical"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

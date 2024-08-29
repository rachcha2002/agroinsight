import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const agrochemicalsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="fertilizers"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="pesticides"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="news"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="myf&ps"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#f3f6f4" style="dark" />
    </>
  );
};

export default agrochemicalsLayout;

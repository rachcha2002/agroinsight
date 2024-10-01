import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const agrochemicalsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="fertilizer"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="pesticide"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="agrochemicalnews"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="myagrochemicals"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="createffertilizer"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="createfpesticide"
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

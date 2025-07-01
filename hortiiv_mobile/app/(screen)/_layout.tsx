// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f8e1e9" },
        headerTintColor: "#333",
      }}>
      <Stack.Screen
        name="homescreen"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="MyAccount"
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="notification"
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="products"
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="SoldItemsScreen"
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="UploadProductScreen"
        options={{ title: "Register", headerShown: false }}
      />
    </Stack>
  );
}
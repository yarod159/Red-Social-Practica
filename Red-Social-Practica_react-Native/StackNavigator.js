import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import ShareScreen from "./screens/ShareScreen";
import { SimpleLineIcons } from "@expo/vector-icons";
import SearchScreen from "./screens/SearchScreen";
import ActivityScreen from "./screens/ActivityScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "./consts/colors";
import EditProfile from "./screens/EditProfile";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.huevo,
            marginHorizontal: 90,
            borderRadius: 10,
            top: -10,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <SimpleLineIcons
                  name="book-open"
                  size={29}
                  color={COLORS.primary}
                />
              ) : (
                <SimpleLineIcons
                  name="book-open"
                  size={29}
                  color={COLORS.gris}
                />
              ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: "Search",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Feather name="search" size={29} color={COLORS.primary} />
              ) : (
                <Feather name="search" size={29} color={COLORS.gris} />
              ),
          }}
        />

        <Tab.Screen
          name="Share"
          component={ShareScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  top: -10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ top: 18 }}>
                  <AntDesign
                    name="plus"
                    size={29}
                    color={focused ? COLORS.white : COLORS.white}
                  />
                </View>
                <View
                  style={{
                    height: 60,
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: focused ? COLORS.primary : COLORS.gris,
                    borderColor: focused ? COLORS.primary : COLORS.white,
                    borderWidth: 2,
                    borderRadius: 30,
                    top: -25,
                    elevation: 5,
                    zIndex: -1,
                  }}
                />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: "Activity",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Feather name="bookmark" size={29} color={COLORS.primary} />
              ) : (
                <Feather name="bookmark" size={29} color={COLORS.gris} />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="person-outline"
                  size={29}
                  color={COLORS.primary}
                />
              ) : (
                <Ionicons name="person-outline" size={29} color={COLORS.gris} />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});

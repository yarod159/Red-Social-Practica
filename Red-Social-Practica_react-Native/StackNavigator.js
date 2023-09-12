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
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          style: {
            height: 30,
            borderTopWidth: 0,
            elevation: 0,
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
                <SimpleLineIcons name="book-open" size={24} color="black" />
              ) : (
                <SimpleLineIcons name="book-open" size={24} color="red" />
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
                <SimpleLineIcons name="book-open" size={24} color="black" />
              ) : (
                <SimpleLineIcons name="book-open" size={24} color="red" />
              ),
          }}
        />

        <Tab.Screen
          name="Share"
          component={ShareScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              focused ? (
                <SimpleLineIcons name="book-open" size={24} color="black" />
                ) : (
                <SimpleLineIcons name="book-open" size={24} color="red" />
                ),
              <View
                style={{
                  height: 60,
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderColor: "orange",
                  borderWidth: 2,
                  borderRadius: 30,
                  top: -25,
                  elevation: 5,
                }}
              >
               
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
                <SimpleLineIcons name="book-open" size={24} color="black" />
              ) : (
                <SimpleLineIcons name="book-open" size={24} color="red" />
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
                <SimpleLineIcons name="book-open" size={24} color="black" />
              ) : (
                <SimpleLineIcons name="book-open" size={24} color="red" />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});

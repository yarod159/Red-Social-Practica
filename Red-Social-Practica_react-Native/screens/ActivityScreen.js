import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { UserType } from "../UserContext";
import User from "../components/User";
import COLORS from "../consts/colors";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const ActivityScreen = () => {
  const [selectedButton, setSelctedButton] = useState("people");
  const [content, setContent] = useState("People Content");
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const handleButtonClick = (buttonName) => {
    setSelctedButton(buttonName);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://192.168.0.109:8000/user/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    fetchUsers();
  }, []);
  console.log("users", users);
  return (
    <ScrollView style={{ marginTop: 37 }}>
      <View style={{ marginHorizontal: 90 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => handleButtonClick("people")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                borderColor: COLORS.primary,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                
              },
              selectedButton === "people"
                ? { backgroundColor: COLORS.primary }
                : { backgroundColor: COLORS.huevo },
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "people"
                  ? { color: COLORS.primary }
                  : { color: COLORS.gris },
              ]}
            >
              <Feather
                name="user-plus"
                size={21.3}
                color={selectedButton === "people" ? COLORS.white : COLORS.gris}
              />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("all")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
                
              },
              selectedButton === "all"
                ? { backgroundColor: COLORS.primary }
                : { backgroundColor: COLORS.huevo },
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "all"
                  ? { color: COLORS.primary }
                  : { color: COLORS.gris },
              ]}
            >
              <Ionicons
                name="ios-person-outline"
                size={20}
                color={selectedButton === "all" ? COLORS.white : COLORS.gris}
              />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleButtonClick("requests")}
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "white",
               
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
               
              },
              selectedButton === "requests"
              ? { backgroundColor: COLORS.primary }
              : { backgroundColor: COLORS.huevo },
            ]}
          >
            <Text
              style={[
                { textAlign: "center", fontWeight: "bold" },
                selectedButton === "requests"
                  ? { color: COLORS.primary }
                  : { color: COLORS.gris },
              ]}
            >
              <Ionicons
                name="ios-people-outline"
                size={20}
                color={
                  selectedButton === "requests" ? COLORS.white : COLORS.gris
                }
              />
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {selectedButton === "people" && (
            <View style={{ marginTop: 20 , marginHorizontal:-70 }}>
              {users?.map((item, index) => (
                <User key={index} item={item} />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({});

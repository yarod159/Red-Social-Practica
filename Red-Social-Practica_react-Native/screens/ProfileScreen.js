import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SERVER_IP } from "../utils/config.js";
import { UserType } from "../UserContext.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../consts/colors";
import EditProfile from "./EditProfile.js";
import Icon from "react-native-vector-icons/FontAwesome";

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${SERVER_IP}/profile/${userId}`);
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts(); // Añade esta línea
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/profile/${userId}`);
      const { user } = response.data;
      setUser(user);
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log(user);

  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Login");
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/get-user-posts/${userId}`);
      setUserPosts(response.data);
    } catch (error) {
      console.log("Error fetching user's posts", error);
    }
  };

  return (
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: COLORS.primary,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              FoodShare
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
        >
          <View>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                resizeMode: "contain",
              }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>Comida</Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Recetas | Videos
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>lorem</Text>
          </View>
        </View>
        <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
          {user?.followers?.length} seguidores
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Pressable
            onPress={() => navigation.navigate("EditProfile")}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Editar Perfil</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Cerrar Sesion</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={userPosts}
        style={{
          marginTop: 10,
          position: "relative",
          left: 20,
          left: 0,
          borderRadius: 25,
        }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(post) => post._id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: COLORS.huevo,
              borderRadius: 25,
              marginVertical: 10,
            }}
          >
            <Image
              style={{
                width: 380,
                height: 200,
                resizeMode: "cover",
                borderRadius: 25,
              }}
              source={{
                uri: "https://www.cocinacaserayfacil.net/wp-content/uploads/2020/03/Recetas-faciles-de-cocinar-y-sobrevivir-en-casa-al-coronavirus_2.jpg",
              }}
            />
            <Text style={{ marginHorizontal: 20, marginVertical: 20 }}>
              {item.content}
            </Text>

            <Text style={{ marginHorizontal: 20}} >me gustas: {item.likes.length}</Text>

            <Text  style={{ marginHorizontal: 20, marginBottom: 9 }}>comentarios: {item.comments.length}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});

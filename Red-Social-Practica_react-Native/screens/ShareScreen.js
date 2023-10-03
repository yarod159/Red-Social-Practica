import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import COLORS from "../consts/colors";
import { UserType } from "../UserContext";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
const ShareScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");

  const handlePostSubmit = () => {
    const postData = {
      userId,
    };

    if (content) {
      postData.content = content;
      
    axios
    .post("http://192.168.0.109:8000/create-post", postData)
    .then((response) => {
      setContent("");
    })
    .catch((error) => {
      console.log("error al crear el post post", error);
    });
    } else {
      // Display an alert to the user indicating that they need to enter content
      Alert.alert("Debes llenar los campos para poder publicar");
    }

  };
  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          marginTop: 40,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Image
          style={{ width: 200, height: 50, resizeMode: "contain" }}
          source={{
            uri: "https://purppl.com/wp-content/uploads/2021/11/FoodShare-logo-green.png",
          }}
        />
        <TouchableOpacity
          style={{
            borderRadius: 10,
            backgroundColor: COLORS.blueberry,
            padding: 10,
            width: 100,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handlePostSubmit}
        >
          <Text style={{ color: COLORS.white }}>Compartir</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 30, marginHorizontal: 5 }}>
        <Text
          style={{
            marginHorizontal: 10,
            fontSize: 15,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Mi Receta:
        </Text>
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder="Esta es mi Recta de ..."
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            paddingVertical: 15,
            height: 190,
            paddingHorizontal: 15,
          }}
          value={content}
          onChangeText={(text) => setContent(text)}
        />
      </View>
      <View
        style={{
          marginTop: 20,
         
        }}
      >
        <Text
          style={{
            marginHorizontal: 10,
            fontSize: 15,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
         Subir una foto:
        </Text>

        <TouchableOpacity
          style={{
            padding: 10,

            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handlePostSubmit}
        >
          <MaterialIcons
            name="add-photo-alternate"
            size={38}
            color={COLORS.gris}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ShareScreen;

const styles = StyleSheet.create({});

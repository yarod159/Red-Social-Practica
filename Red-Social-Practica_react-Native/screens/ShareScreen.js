import {
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
import axios from "axios"
const ShareScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");
  
  const handlePostSubmit = () => {
    const postData = {
      userId,
    };

    if (content) {
      postData.content = content;
    }

    axios
      .post("http://192.168.0.109:8000/create-post", postData)
      .then((response) => {
        setContent("");
      })
      .catch((error) => {
        console.log("error creating post", error);
      });
  };
  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Image
          style={{ width: 200, height: 50, resizeMode: "contain" }}
          source={{
            uri: "https://purppl.com/wp-content/uploads/2021/11/FoodShare-logo-green.png",
          }}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder="Esta es mi Recta de ..."
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            paddingVertical: 15,
            height: 50,
            paddingHorizontal: 15,
          }}
          value={content}
          onChangeText={(text) => setContent(text)}
        />
      </View>
      <View
        style={{
          marginTop: 400,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            borderRadius: 10,
            backgroundColor: COLORS.primary,
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
    </SafeAreaView>
  );
};

export default ShareScreen;

const styles = StyleSheet.create({});

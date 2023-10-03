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
import { SERVER_IP } from "../utils/config.js";
import * as ImagePicker from "expo-image-picker";
import { uploadFile } from "../firebase/config";

const ShareScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);

  const handlePostSubmit = async () => {
    if (file && content) {
      try {
        // Sube la foto a Firebase y obtén la URL
        const url = await uploadFile(file);

        // Crea los datos del post
        const postData = {
          userId,
          content,
          photoUrl: url, // Incluye la URL de la foto en los datos del post
        };

        // Publica el post
        await axios.post(`${SERVER_IP}/create-post`, postData);

        // Limpia el estado
        setContent("");
        setFile(null);
        setPhoto(null);
      } catch (error) {
        console.log("Error al crear el post", error);
      }
    } else {
      Alert.alert(
        "Debes seleccionar una foto y escribir contenido para poder publicar"
      );
    }
  };

  const handleUploadPhoto = () => {
    fetch(`${SERVER_IP}/create-post`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: createFormData(photo, { userId: "123" }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("upload succes", response);
        setPhoto(null);
      })
      .catch((error) => {
        console.log("upload error", error);
      });
  };

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Aquí es donde haces el cambio
      setPhoto(result.assets[0].uri);
      const file = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
        type: "image/jpg",
      };
      setFile(file);
      const url = await uploadFile(file);
      console.log(url); // Aquí puedes ver la URL de la imagen subida
    }
  };

  const createFormData = (photo, body) => {
    const data = new FormData();

    data.append("photo", {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const resul = uploadFile(file);
    } catch (error) {
      console.log("error", error);
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
          onPress={handleChoosePhoto}
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

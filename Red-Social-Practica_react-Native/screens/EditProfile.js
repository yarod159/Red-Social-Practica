import {
  Button,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import COLORS from "../consts/colors";
import axios from "axios";
import { SERVER_IP } from "../utils/config.js";
import { Feather } from "@expo/vector-icons";
import { UserType } from "../UserContext";

const EditProfile = ({ navigation, route }) => {
  //const item = route.params;
  const [nameProfile, setNameProfile] = useState("");
  const [surname, setSurname] = useState("");
  const [presentation, setPresentation] = useState("");
  const [telephone, setTelephone] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const [isIconVisible, setIsIconVisible] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  


  async function saveProfile() {
    try {
      const response = await axios.post(`${SERVER_IP}/profile`, {
        userId,
        nameProfile,
        surname,
        telephone,
        presentation
      });
  
      if (response.data) {
        setIsSaved(true);
        setIsIconVisible(false);
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al guardar el perfil');
    }
  }
  
 

  return (
    <SafeAreaView style={{ marginHorizontal: 10 }}>
      <View
        style={{
          flexDirection: "row",
          paddingTop: 55,
          paddingBottom: 10,
          alignItems: "center",
          backgroundColor: COLORS.white,
        }}
      >
        <AntDesign
          name="left"
          size={30}
          color="black"
          onPress={navigation.goBack}
        />
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>Atras</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Image
          style={{
            width: 80,
            height: 80,
            borderRadius: 30,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />

        <Pressable style={{ top: 10, marginBottom: 25 }}>
          <Text style={{ color: COLORS.blueberry }}>
            Cambiar foto de Perfil
          </Text>
        </Pressable>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: COLORS.gris, fontSize: 13 }}>Nombre</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TextInput
            style={{ borderBottomWidth: 0.5, paddingVertical: 8, flex: 1 }}
            onChangeText={(text) => setNameProfile(text)}
            value={nameProfile}
          ></TextInput>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: COLORS.gris, fontSize: 13 }}>Apellido</Text>
        <TextInput
          style={{ borderBottomWidth: 0.5, paddingVertical: 8 }}
          onChangeText={(text) => setSurname(text)}
          value={surname}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: COLORS.gris, fontSize: 13 }}>Presentacion</Text>
        <TextInput
          style={{ borderBottomWidth: 0.5, paddingVertical: 8 }}
          onChangeText={(text) => setPresentation(text)}
          value={presentation}
        />
      </View>

      <View>
        <Text style={{ color: COLORS.gris, fontSize: 13 }}>Telefono</Text>
        <TextInput
          style={{ borderBottomWidth: 0.5, paddingVertical: 8 }}
          onChangeText={(text) => setTelephone(text)}
          value={telephone}
        />
      </View>

      {isIconVisible && (
        <Pressable>
          <Feather name="check" size={24} color="black" onPress={saveProfile} />
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});

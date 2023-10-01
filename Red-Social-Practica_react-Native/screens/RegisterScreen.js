import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { SERVER_IP } from '../utils/config.js';

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [name, setName] = useState("");
  
  const handleRegister = () => {
   
    const user = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post(`${SERVER_IP}/register`, user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registro exitoso",
          "tu estas registrado sactifactoriamente "
        );
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registro fallido",
          "Error en el registro: " + error.message
        );
       
        console.log(error.toJSON())
      });
  };


  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 200, height: 150, resizeMode: "contain", top: 30 }}
          source={{
            uri: "https://purppl.com/wp-content/uploads/2021/11/FoodShare-logo-green.png",
          }}
        ></Image>
      </View>

      <KeyboardAvoidingView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17, marginTop: 25 }}>
            Registre sus datos
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",

              justifyContent: "space-around",
              alignItems: "center",
              borderColor: "#FF7D14",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            <FontAwesome name="user" size={24} color="#FF7D14" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor={"gray"}
              style={{
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Nombre de Usuario"
            ></TextInput>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            borderColor: "#FF7D14",
            borderWidth: 1,
            paddingVertical: 5,
            borderRadius: 8,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <MaterialIcons
              style={{ top: 12, marginRight: 5 }}
              name="email"
              size={24}
              color="#FF7D14"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"gray"}
              style={{
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Introduce tu correo"
            ></TextInput>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              borderColor: "#FF7D14",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <Feather
              style={{ marginLeft: 10, marginRight: 5 }}
              name="lock"
              size={24}
              color="#FF7D14"
            />
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholderTextColor={"gray"}
              style={{
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Introduce tu contraseña"
            ></TextInput>
          </View>
        </View>

        <View style={{ marginTop: 40 }} />

        <Pressable
          onPress={handleRegister}
          style={{
            width: 200,
            borderRadius: 10,
            backgroundColor: "#FF7D14",
            padding: 15,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: 1,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Registrar
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}
        >
          <Text>¿Ya tienes una cuenta? Inicia Sesión</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});

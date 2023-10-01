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
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";



const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(()=>{
    const checkLoginStatus=  async () =>{
      try {
        const token= await AsyncStorage.getItem("authToken")

        if(token){
          setTimeout(()=>{
            navigation.replace("Main");
          },400)
        }

      } catch (error) {
        console.log("error", error)
      }
    }
    checkLoginStatus();
  }, [])

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post("http://192.168.0.109:8000/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.navigate("Main");
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message === "Usuario no verificado") {
          // Mostrar un mensaje al usuario indicándole que necesita verificar su correo electrónico
         
        }
        Alert.alert(
          "Debes verificar tu correo"
        );
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
              Ingrese sus datos
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#FF7D14",
              borderWidth: 1,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons
                style={{ marginLeft: 10, top: 12 }}
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
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#FF7D14",
                borderWidth: 1,
                paddingVertical: 5,
                borderRadius: 8,
              }}
            >
              <Feather
                style={{ marginLeft: 10 }}
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              Mantenme conectado
            </Text>
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              Olvide mi contraseña{" "}
            </Text>
          </View>

          <View style={{ marginTop: 40 }} />

          <Pressable
            onPress={handleLogin}
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
              Login
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}
          >
            <Text>¡No tienes una cuenta? Registrate</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
 
};
export default LoginScreen;

const styles = StyleSheet.create({});

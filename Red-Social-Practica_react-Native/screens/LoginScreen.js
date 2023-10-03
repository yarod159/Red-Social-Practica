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
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { SERVER_IP } from "../utils/config.js";
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [error, setError] = useState("");
  
  const [hidePassword, setHidePassword] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          setTimeout(() => {
            navigation.replace("Main");
          }, 400);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post(`${SERVER_IP}/login`, user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.navigate("Main");
        
        fetch("/protected-route")
          .then((response) => {
            if (response.ok) {
              // User is verified, allow access to restricted features or content
              // Display the response message or perform additional actions
              console.log("User is verified");
            } else {
              // User is not verified, handle accordingly
              // Display a message or redirect to a different page
              console.log("User is not verified");
            }
          })
          .catch((error) => {
            // Handle any errors that occurred during the request
            // Display an error message or perform error handling
            console.log("Error occurred:", error);
          });
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response.data.message === "Usuario no verificado") {
          // Mostrar un mensaje al usuario indicándole que necesita verificar su correo electrónico
          console.log("Usuario no verificado");
        }
        Alert.alert("Debes verificar tu correo");
      });
  };

  const validateEmail = (text) => {
    setEmail(text);

    // Expresión regular para validar el correo electrónico
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!text) {
      setError("Debes llenar el email");
    } else if (!regex.test(text)) {
      setError("Correo no válido");
    } else {
      setError("");
    }
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
              onChangeText={validateEmail}
              placeholderTextColor={"gray"}
              style={{
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Introduce tu correo"
            />
            {error ? <Text style={{ color: "red" ,position:"relative",left:-80 , marginHorizontal:-72 ,paddingLeft:15}}>{error}</Text> : null}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TextInput
        secureTextEntry={hidePassword}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor={"gray"}
        style={{
          marginVertical: 10,
          width: 260, // Reducir el ancho para dejar espacio para el icono
          fontSize: password ? 16 : 16,
        }}
        placeholder="Introduce tu contraseña"
      />
      <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
        <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={24} color="gray" />
      </TouchableOpacity>
    </View>
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

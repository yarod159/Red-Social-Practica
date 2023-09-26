import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import COLORS from "../consts/colors";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get("http://192.168.0.109:8000/get-posts");
      setPosts(response);
    } catch (error) {
      console.log("error de post ", error);
    }
  };
  console.log("posts", posts);
  return (
    <FlatList style={{marginTop:50,flex:1,backgroundColor:COLORS.white}}>
     <View style={{backgroundColor:"red",padding:50}}><Text >HomeScreen</Text></View> 
    </FlatList>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

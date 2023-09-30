import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Image, Text, FlatList } from "react-native";
import { Modal, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { SERVER_IP } from '../utils/config.js';
const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);

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
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/get-posts`);
      setPosts(response.data);
    } catch (error) {
      console.log("error fetching posts", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `${SERVER_IP}/posts/${postId}/${userId}/like`
       
      );
      const updatedPost = response.data;

      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `${SERVER_IP}/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const response = await axios.post(
        `${SERVER_IP}/posts/${postId}/comments`,
        {
          userId: userId,
          content: commentContent,
        }
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      setPosts(updatedPosts);
      setModalVisible(false);
      setCommentContent("");
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 15,
        borderColor: "#D0D0D0",
        borderTopWidth: 1,
        flexDirection: "row",
        gap: 10,
        marginVertical: 10,
      }}
    >
      <View>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/000/364/628/non_2x/vector-chef-avatar-illustration.jpg",
          }}
        />
      </View>

      <View>
        <Text style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>
          {item?.user?.name}
        </Text>
        <Text>{item?.content}</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => setCommentsVisible(!commentsVisible)}
          >
            <FontAwesome name="comment-o" size={18} color="black" />
          </TouchableOpacity>

          {item?.likes?.includes(userId) ? (
            <AntDesign
              onPress={() => handleDislike(item?._id)}
              name="heart"
              size={18}
              color="red"
            />
          ) : (
            <AntDesign
              onPress={() => handleLike(item?._id)}
              name="hearto"
              size={18}
              color="black"
            />
          )}

          <FontAwesome
            onPress={() => {
              setCurrentPostId(item._id);
              setModalVisible(true);
            }}
            name="comment-o"
            size={18}
            color="black"
          />

          <Ionicons name="share-social-outline" size={18} color="black" />
        </View>

        <Text style={{ marginTop: 7, color: "gray" }}>
          {item?.likes?.length} likes • {item?.replies?.length} reply
        </Text>
      </View>
      {commentsVisible && (
        <View>
          {item.comments.map((comment) => (
            <View key={comment._id} style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold" }}>{comment.user.name}</Text>
              <Text>{comment.content}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={{ marginTop: 10, flex: 1 }}>
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Image
          style={{ width: 200, height: 50, resizeMode: "contain" }}
          source={{
            uri: "https://purppl.com/wp-content/uploads/2021/11/FoodShare-logo-green.png",
          }}
        />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ backgroundColor: "white", padding: 20, width: "80%" }}>
            <TextInput
              placeholder="Escribe tu comentario..."
              value={commentContent}
              onChangeText={(text) => setCommentContent(text)}
            />
            <Button
              title="Enviar comentario"
              onPress={() => handleComment(currentPostId)}
            />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Image, Text, FlatList, Alert } from "react-native";
import { Modal, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { SERVER_IP } from "../utils/config.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../consts/colors";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import UserProfile from "./UserProfile";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [bookmarkedPostId, setBookmarkedPostId] = useState(null);
  const [postDate, setPostDate] = useState("null");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigation = useNavigation();

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

  useEffect(() => {
    fetchPosts();
  }, [searchTerm]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${SERVER_IP}/get-posts`);
      let fetchedPosts = response.data;

      // Filtrarmos las publicaciones si hay un término de búsqueda
      if (searchTerm.startsWith("#")) {
        const hashtag = searchTerm.slice(1); // Eliminar el símbolo '#'
        fetchedPosts = fetchedPosts.filter((post) =>
          post.content.includes(`#${hashtag}`)
        );
      }

      setPosts(fetchedPosts);
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
      fetchPosts();
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  const handleDelete = (postId) => {
    Alert.alert(
      "Eliminar post - Al pasar 24 hrs no se podras eliminar",
      "¿Estás seguro de que deseas eliminar este post?  ",

      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: async () => {
            try {
              // Obtén el token del almacenamiento local
              const token = await AsyncStorage.getItem("authToken");

              // Haz una petición DELETE al endpoint de eliminación de posts
              await axios.delete(`${SERVER_IP}/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { userId: userId },
              });

              // Actualiza la lista de posts después de eliminar el post
              fetchPosts();
            } catch (error) {
              console.log("Error al eliminar el post:", error);
            }
          },
        },
      ]
    );
  };

  const handleNameClick = (userId) => {
    // Navega a la pantalla de perfil del usuario
    navigation.navigate("UserProfile", { userId: userId });
  };

  ///
  ///
  ///Desing
  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 15,
        borderColor: "#D0D0D0",
        borderTopWidth: 1,
        flexDirection: "column",
        gap: 10,
        marginVertical: 10,
      }}
    >
      <View style={{ flexDirection: "row" }}>
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

        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Text
              style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}
              onPress={() => handleNameClick(item?.user?._id)}
            >
              {item?.user?.name}
            </Text>

            {userId === item?.user?._id && (
              <View style={{ position: "absolute", left: 300 }}>
                <MaterialCommunityIcons
                  onPress={() => handleDelete(item?._id)}
                  name="delete-clock-outline"
                  size={24}
                  color={COLORS.gris}
                />
              </View>
            )}
          </View>
          <View style={{ flexDirection: "column" }}>
            <View>
              <Image
                style={{
                  width: 380,
                  height: 200,
                  resizeMode: "cover",
                  top: 38,
                  position: "relative",
                  left: -40,
                  borderRadius: 20,
                }}
                source={{
                  uri: item?.photo,
                }}
              />
            </View>

            <View style={{ marginTop: 50 }}>
              <Text>{item?.content}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setCommentsVisible(!commentsVisible);
                setSelectedPostId(item._id); // Añade esta línea
              }}
            >
              <MaterialIcons
                name="keyboard-arrow-down"
                size={29}
                color="black"
              />
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

            <Feather
              onPress={() => {
                if (bookmarkedPostId === item._id) {
                  // Si el post ya está marcado, desmarca el post
                  setBookmarkedPostId(null);
                } else {
                  // Si el post no está marcado, marca el post
                  setBookmarkedPostId(item._id);
                }
              }}
              name="bookmark"
              size={24}
              color={bookmarkedPostId === item._id ? "red" : "black"}
            />

            <FontAwesome
              onPress={() => {
                setCurrentPostId(item._id);
                setModalVisible(true);
              }}
              name="comment-o"
              size={18}
              color="black"
            />
          </View>

          <Text style={{ marginTop: 7, color: "gray" }}>
            {item?.likes?.length} me gusta • {item.comments?.length || 0}{" "}
            {item.comments?.length <= 1 ? "comentario" : "comentarios"}
          </Text>
        </View>
      </View>
      <View>
        {commentsVisible && item._id === selectedPostId && (
          <View style={{ marginLeft: 30 }}>
            {item.comments.map((comment) => (
              <View
                key={comment._id}
                style={{ marginTop: 10, flexDirection: "row" }}
              >
                <Text style={{ fontWeight: "bold" }}> {comment.user.name}</Text>
                <Text style={{ marginLeft: 10 }}>{comment.content}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  ///
  ///
  ///
  ///return
  return (
    <View style={{ marginTop: 10, flex: 1 }}>
      <View
        style={{
          marginTop: 20,
          alignItems: "center",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 200, height: 50, resizeMode: "contain" }}
          source={{
            uri: "https://purppl.com/wp-content/uploads/2021/11/FoodShare-logo-green.png",
          }}
        />
        <Entypo
          style={{ position: "relative" }}
          name="magnifying-glass"
          size={18}
          color={COLORS.gris}
        />
        <TextInput
          style={{
            borderWidth: 0.9,
            borderRadius: 10,
            width: 200,
            height: 35,
            borderColor: COLORS.gris,
            position: "relative",
            right: 25,
            paddingLeft: 28,
          }}
          onChangeText={(text) => setSearchTerm(text)}
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

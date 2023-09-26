import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState ,useEffect} from "react";
import COLORS from "../consts/colors";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  console.log("sds",item);
  const [requestSent, setRequestSent] = useState(false);
  const sendFollow = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.0.109:8000/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      const response = await fetch("http://192.168.0.109:8000/users/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loggedInUserId: userId,
          targetUserId: targetId,
        }),
      });

      if(response.ok){
          setRequestSent(false);
          console.log("dejar de seguir sactifactorio")
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    // Restablece el estado de solicitud enviada cada vez que cambia el ID de usuario o la propiedad del elemento
    setRequestSent(false);
  }, [userId, item]);
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            marginVertical: 5,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/000/364/628/non_2x/vector-chef-avatar-illustration.jpg",
          }}
        />
        <Text style={{ marginLeft: 10, flex: 1, fontSize: 15 }}>
          {item?.name}
        </Text>

        {requestSent || item?.followers?.includes(userId) ? (
          <Pressable
            onPress={() =>  handleUnfollow(item?._id)}
            style={{
              borderColor: COLORS.gris,
              borderWidth: 0.5,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
              width: 100,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Siguiendo</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => sendFollow(userId, item._id)}
            style={{
              borderColor: COLORS.gris,
              borderWidth: 0.5,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
              width: 100,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Seguir</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});

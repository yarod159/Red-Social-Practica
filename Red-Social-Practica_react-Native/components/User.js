import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import COLORS from "../consts/colors";
const User = ({ item }) => {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", }}>
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
        <Text style={{ marginLeft: 10 ,flex:1, fontSize:15}}>{item?.name}</Text>

        <Pressable
        onPress={ () => sendFollow(userId,item._id) }
          style={{
            borderColor: COLORS.gris,
            borderWidth: 0.5,
            borderRadius: 5,
            paddingHorizontal:10,
            paddingVertical:5,
            width:100,
            alignItems:"center"
          }}
        >
          <Text style={{fontSize:15,fontWeight:"bold"}}>Seguir</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});

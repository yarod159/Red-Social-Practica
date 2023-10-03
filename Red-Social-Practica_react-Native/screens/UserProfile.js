import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({route}) => {
  const { userId } = route.params;
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`${SERVER_IP}/get-user-posts/${userId}`);
        setUserPosts(response.data);
      } catch (error) {
        console.log("Error fetching user's posts", error);
      }
    };

    fetchUserPosts();
  }, []);


  return (
    <View>
      <Text>UserProfile</Text>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default UserProfile
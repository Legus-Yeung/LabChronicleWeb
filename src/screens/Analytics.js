import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat';
import style from '../styles.js';

export default function Analytics({ navigation }) {
  const [userClasses, setUserClasses] = useState([]);

  useEffect(() => {
    const currentUserUid = firebase.auth().currentUser.uid;
    const query = firebase.firestore().collection('classroom').where('prof', '==', currentUserUid);

    const unsubscribe = query.onSnapshot((snapshot) => {
      const classes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort classes by year and semester
      const sortedClasses = classes.sort((a, b) => {
        // First, sort by year in descending order
        if (b.year !== a.year) {
          return b.year - a.year;
        }

        // If the years are the same, sort by semester
        const semesterOrder = { Fall: 0, Winter: 1, Summer: 2 };
        return semesterOrder[b.semester] - semesterOrder[a.semester];
      });

      setUserClasses(sortedClasses);
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={style.input} onPress={() => handleClassPress(item)}>
      <Text style={style.inputText}>{`${item.year} ${item.semester} - ${item.className}`}</Text>
    </TouchableOpacity>
  );

  const handleClassPress = (item) => {
    // Navigate to the ClassAnalytics screen
    navigation.navigate('ClassAnalytics', { classId: item.id });
  };

  return (
    <View style={style.container}>
      <View style={style.headerContainerDashboard}>
        <Text style={style.headerTextStyle}>Your Daddy:</Text>
      </View>
      <FlatList
        style={style.recordButton}
        data={userClasses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
